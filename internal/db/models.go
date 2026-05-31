package db

import (
	"gorm.io/gorm"
)

type PermissionType string
type HookEvent string
type ProfileScope string

const (
	PermissionAllow PermissionType = "allow"
	PermissionDeny  PermissionType = "deny"

	HookPreToolUse   HookEvent = "PreToolUse"
	HookPostToolUse  HookEvent = "PostToolUse"
	HookStop         HookEvent = "Stop"
	HookNotification HookEvent = "Notification"

	ScopeAgent   ProfileScope = "agent"
	ScopeTask    ProfileScope = "task"
	ScopeProject ProfileScope = "project"
)

type HarnessProfile struct {
	gorm.Model
	Name          string       `gorm:"not null;uniqueIndex" json:"name"`
	Description   string       `json:"description"`
	Scope         ProfileScope `gorm:"default:'agent'" json:"scope"`
	ModelOverride string       `json:"modelOverride"`
}

type HarnessPermission struct {
	gorm.Model
	ProfileID uint           `gorm:"not null;index" json:"profileId"`
	Type      PermissionType `gorm:"not null" json:"type"`
	Tool      string         `gorm:"not null" json:"tool"`
	SortOrder int            `gorm:"default:0" json:"sortOrder"`
}

type HarnessHook struct {
	gorm.Model
	ProfileID      uint      `gorm:"not null;index" json:"profileId"`
	Event          HookEvent `gorm:"not null" json:"event"`
	Matcher        string    `gorm:"not null" json:"matcher"`
	Command        string    `gorm:"not null" json:"command"`
	Blocking       bool      `gorm:"default:false" json:"blocking"`
	TimeoutSeconds int       `gorm:"default:30" json:"timeoutSeconds"`
	SortOrder      int       `gorm:"default:0" json:"sortOrder"`
}

type HarnessEnvVar struct {
	gorm.Model
	ProfileID uint   `gorm:"not null;index" json:"profileId"`
	Key       string `gorm:"not null" json:"key"`
	Value     string `json:"value"`
	SortOrder int    `gorm:"default:0" json:"sortOrder"`
}

// HarnessProfileFull はプロファイルと全関連レコードをまとめた表示用構造体
type HarnessProfileFull struct {
	HarnessProfile
	Permissions []HarnessPermission `json:"permissions"`
	Hooks       []HarnessHook       `json:"hooks"`
	EnvVars     []HarnessEnvVar     `json:"envVars"`
}

// ─── リクエスト構造体 ──────────────────────────────────────────────

type PermissionInput struct {
	Type PermissionType `json:"type"`
	Tool string         `json:"tool"`
}

type HookInput struct {
	Event          HookEvent `json:"event"`
	Matcher        string    `json:"matcher"`
	Command        string    `json:"command"`
	Blocking       bool      `json:"blocking"`
	TimeoutSeconds int       `json:"timeoutSeconds"`
}

type EnvVarInput struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type CreateProfileRequest struct {
	Name          string            `json:"name"`
	Description   string            `json:"description"`
	Scope         ProfileScope      `json:"scope"`
	ModelOverride string            `json:"modelOverride"`
	Permissions   []PermissionInput `json:"permissions"`
	Hooks         []HookInput       `json:"hooks"`
	EnvVars       []EnvVarInput     `json:"envVars"`
}

type UpdateProfileRequest struct {
	Name          string            `json:"name"`
	Description   string            `json:"description"`
	Scope         ProfileScope      `json:"scope"`
	ModelOverride string            `json:"modelOverride"`
	Permissions   []PermissionInput `json:"permissions"`
	Hooks         []HookInput       `json:"hooks"`
	EnvVars       []EnvVarInput     `json:"envVars"`
}
