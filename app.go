package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/chankei613/harness-manager/internal/db"
	"github.com/chankei613/harness-manager/internal/harness"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx     context.Context
	ready   bool
	manager *harness.Manager
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	dataDir := appDataDir()
	if err := os.MkdirAll(dataDir, 0700); err != nil {
		runtime.LogErrorf(ctx, "data dir error: %s", err)
		return
	}

	if err := db.Init(filepath.Join(dataDir, "harness.db")); err != nil {
		runtime.LogErrorf(ctx, "db init error: %s", err)
		return
	}

	a.manager = harness.NewManager()
	a.ready = true
	runtime.LogInfof(ctx, "Harness Manager started (data: %s)", dataDir)
}

func (a *App) shutdown(ctx context.Context) {
	runtime.LogInfo(ctx, "Harness Manager shutting down")
}

func (a *App) checkReady() error {
	if !a.ready {
		return fmt.Errorf("app not ready — check startup logs")
	}
	return nil
}

// ─── 基本バインディング ────────────────────────────────────────────

func (a *App) GetAppVersion() string {
	return AppVersion
}

func (a *App) Quit() {
	runtime.Quit(a.ctx)
}

// ─── プロファイル CRUD ─────────────────────────────────────────────

func (a *App) ListProfiles() ([]db.HarnessProfile, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	return db.ListProfiles()
}

func (a *App) GetProfile(id uint) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	return db.GetProfileFull(id)
}

func (a *App) CreateProfile(req db.CreateProfileRequest) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	return db.CreateProfile(req)
}

func (a *App) UpdateProfile(id uint, req db.UpdateProfileRequest) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	return db.UpdateProfile(id, req)
}

func (a *App) DeleteProfile(id uint) error {
	if err := a.checkReady(); err != nil {
		return err
	}
	return db.DeleteProfile(id)
}

func (a *App) DuplicateProfile(id uint, newName string) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	return db.DuplicateProfile(id, newName)
}

// ─── プリセット ────────────────────────────────────────────────────

func (a *App) GetPresets() []harness.Preset {
	return harness.GetPresets()
}

func (a *App) ImportPreset(presetID string) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	preset, err := harness.FindPreset(presetID)
	if err != nil {
		return nil, err
	}
	return db.CreateProfile(preset.ToCreateRequest())
}

// ─── settings.json 連携 ────────────────────────────────────────────

func (a *App) ExportProfile(id uint, targetPath string) error {
	if err := a.checkReady(); err != nil {
		return err
	}
	profile, err := db.GetProfileFull(id)
	if err != nil {
		return err
	}
	return a.manager.ExportToSettings(profile, targetPath)
}

func (a *App) ImportFromSettings(settingsPath string) (*db.HarnessProfileFull, error) {
	if err := a.checkReady(); err != nil {
		return nil, err
	}
	req, err := a.manager.ImportFromSettings(settingsPath)
	if err != nil {
		return nil, err
	}
	return db.CreateProfile(*req)
}

func (a *App) PreviewExport(id uint) (string, error) {
	if err := a.checkReady(); err != nil {
		return "", err
	}
	profile, err := db.GetProfileFull(id)
	if err != nil {
		return "", err
	}
	return a.manager.PreviewJSON(profile)
}

// ─── ファイルダイアログ ────────────────────────────────────────────

func (a *App) OpenSettingsFilePicker() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select settings.json",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON files", Pattern: "*.json"},
		},
	})
}

func (a *App) OpenDirectoryPicker() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select export directory (.claude folder)",
	})
}

// ─── ヘルパー ─────────────────────────────────────────────────────

func appDataDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return "."
	}
	return filepath.Join(home, ".harness-manager")
}
