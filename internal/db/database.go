package db

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var gdb *gorm.DB

func Init(dbPath string) error {
	var err error
	gdb, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}

	return gdb.AutoMigrate(
		&HarnessProfile{},
		&HarnessPermission{},
		&HarnessHook{},
		&HarnessEnvVar{},
	)
}

// ─── プロファイル CRUD ─────────────────────────────────────────────

func ListProfiles() ([]HarnessProfile, error) {
	var profiles []HarnessProfile
	result := gdb.Order("name asc").Find(&profiles)
	return profiles, result.Error
}

func GetProfileFull(id uint) (*HarnessProfileFull, error) {
	var profile HarnessProfile
	if err := gdb.First(&profile, id).Error; err != nil {
		return nil, fmt.Errorf("profile %d not found: %w", id, err)
	}

	var perms []HarnessPermission
	gdb.Where("profile_id = ?", id).Order("sort_order asc").Find(&perms)

	var hooks []HarnessHook
	gdb.Where("profile_id = ?", id).Order("event asc, sort_order asc").Find(&hooks)

	var envs []HarnessEnvVar
	gdb.Where("profile_id = ?", id).Order("sort_order asc").Find(&envs)

	return &HarnessProfileFull{
		HarnessProfile: profile,
		Permissions:    perms,
		Hooks:          hooks,
		EnvVars:        envs,
	}, nil
}

func CreateProfile(req CreateProfileRequest) (*HarnessProfileFull, error) {
	if req.Scope == "" {
		req.Scope = ScopeAgent
	}

	profile := HarnessProfile{
		Name:          req.Name,
		Description:   req.Description,
		Scope:         req.Scope,
		ModelOverride: req.ModelOverride,
	}

	if err := gdb.Create(&profile).Error; err != nil {
		return nil, fmt.Errorf("create profile: %w", err)
	}

	if err := upsertRelations(profile.ID, req.Permissions, req.Hooks, req.EnvVars); err != nil {
		return nil, err
	}

	return GetProfileFull(profile.ID)
}

func UpdateProfile(id uint, req UpdateProfileRequest) (*HarnessProfileFull, error) {
	var profile HarnessProfile
	if err := gdb.First(&profile, id).Error; err != nil {
		return nil, fmt.Errorf("profile %d not found: %w", id, err)
	}

	profile.Name = req.Name
	profile.Description = req.Description
	profile.Scope = req.Scope
	profile.ModelOverride = req.ModelOverride

	if err := gdb.Save(&profile).Error; err != nil {
		return nil, fmt.Errorf("update profile: %w", err)
	}

	gdb.Where("profile_id = ?", id).Delete(&HarnessPermission{})
	gdb.Where("profile_id = ?", id).Delete(&HarnessHook{})
	gdb.Where("profile_id = ?", id).Delete(&HarnessEnvVar{})

	if err := upsertRelations(id, req.Permissions, req.Hooks, req.EnvVars); err != nil {
		return nil, err
	}

	return GetProfileFull(id)
}

func DeleteProfile(id uint) error {
	gdb.Where("profile_id = ?", id).Delete(&HarnessPermission{})
	gdb.Where("profile_id = ?", id).Delete(&HarnessHook{})
	gdb.Where("profile_id = ?", id).Delete(&HarnessEnvVar{})
	return gdb.Delete(&HarnessProfile{}, id).Error
}

func DuplicateProfile(id uint, newName string) (*HarnessProfileFull, error) {
	src, err := GetProfileFull(id)
	if err != nil {
		return nil, err
	}

	perms := make([]PermissionInput, len(src.Permissions))
	for i, p := range src.Permissions {
		perms[i] = PermissionInput{Type: p.Type, Tool: p.Tool}
	}

	hooks := make([]HookInput, len(src.Hooks))
	for i, h := range src.Hooks {
		hooks[i] = HookInput{
			Event: h.Event, Matcher: h.Matcher, Command: h.Command,
			Blocking: h.Blocking, TimeoutSeconds: h.TimeoutSeconds,
		}
	}

	envs := make([]EnvVarInput, len(src.EnvVars))
	for i, e := range src.EnvVars {
		envs[i] = EnvVarInput{Key: e.Key, Value: e.Value}
	}

	return CreateProfile(CreateProfileRequest{
		Name:          newName,
		Description:   src.Description,
		Scope:         src.Scope,
		ModelOverride: src.ModelOverride,
		Permissions:   perms,
		Hooks:         hooks,
		EnvVars:       envs,
	})
}

// ─── ヘルパー ─────────────────────────────────────────────────────

func upsertRelations(profileID uint, perms []PermissionInput, hooks []HookInput, envs []EnvVarInput) error {
	for i, p := range perms {
		rec := HarnessPermission{ProfileID: profileID, Type: p.Type, Tool: p.Tool, SortOrder: i}
		if err := gdb.Create(&rec).Error; err != nil {
			return fmt.Errorf("create permission: %w", err)
		}
	}

	for i, h := range hooks {
		rec := HarnessHook{
			ProfileID: profileID, Event: h.Event, Matcher: h.Matcher,
			Command: h.Command, Blocking: h.Blocking, TimeoutSeconds: h.TimeoutSeconds, SortOrder: i,
		}
		if err := gdb.Create(&rec).Error; err != nil {
			return fmt.Errorf("create hook: %w", err)
		}
	}

	for i, e := range envs {
		rec := HarnessEnvVar{ProfileID: profileID, Key: e.Key, Value: e.Value, SortOrder: i}
		if err := gdb.Create(&rec).Error; err != nil {
			return fmt.Errorf("create env var: %w", err)
		}
	}

	return nil
}
