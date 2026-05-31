package harness

import (
	"testing"

	"github.com/chankei613/harness-manager/internal/db"
)

func TestGetPresets_ReturnsAllFour(t *testing.T) {
	presets := GetPresets()
	if len(presets) != 4 {
		t.Fatalf("expected 4 presets, got %d", len(presets))
	}
}

func TestGetPresets_AllHaveRequiredFields(t *testing.T) {
	for _, p := range GetPresets() {
		if p.ID == "" {
			t.Errorf("preset %q has empty ID", p.Name)
		}
		if p.Name == "" {
			t.Errorf("preset ID %q has empty Name", p.ID)
		}
		if len(p.Permissions) == 0 {
			t.Errorf("preset %q has no permissions", p.ID)
		}
	}
}

func TestFindPreset_KnownIDs(t *testing.T) {
	ids := []string{"readonly", "backend-dev", "prod-safe", "full-auto"}
	for _, id := range ids {
		p, err := FindPreset(id)
		if err != nil {
			t.Errorf("FindPreset(%q) error: %v", id, err)
			continue
		}
		if p.ID != id {
			t.Errorf("FindPreset(%q) returned wrong ID %q", id, p.ID)
		}
	}
}

func TestFindPreset_UnknownID(t *testing.T) {
	_, err := FindPreset("nonexistent")
	if err == nil {
		t.Fatal("expected error for unknown preset, got nil")
	}
}

func TestToCreateRequest_CopiesFields(t *testing.T) {
	p, _ := FindPreset("readonly")
	req := p.ToCreateRequest()

	if req.Name != p.Name {
		t.Errorf("name mismatch: want %q, got %q", p.Name, req.Name)
	}
	if req.Scope != db.ScopeAgent {
		t.Errorf("scope should be agent, got %q", req.Scope)
	}
	if len(req.Permissions) != len(p.Permissions) {
		t.Errorf("permission count mismatch: want %d, got %d", len(p.Permissions), len(req.Permissions))
	}
}
