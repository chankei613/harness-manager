import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ListProfiles,
  GetProfile,
  CreateProfile,
  UpdateProfile,
  DeleteProfile,
  DuplicateProfile,
  GetPresets,
  ImportPreset,
  ExportProfile,
  ImportFromSettings,
  PreviewExport,
  OpenDirectoryPicker,
  OpenSettingsFilePicker,
} from '../../wailsjs/go/main/App'

export interface Permission {
  id?: number
  profileId?: number
  type: 'allow' | 'deny'
  tool: string
  sortOrder?: number
}

export interface Hook {
  id?: number
  profileId?: number
  event: 'PreToolUse' | 'PostToolUse' | 'Stop' | 'Notification'
  matcher: string
  command: string
  blocking: boolean
  timeoutSeconds: number
  sortOrder?: number
}

export interface EnvVar {
  id?: number
  profileId?: number
  key: string
  value: string
  sortOrder?: number
}

export interface HarnessProfile {
  id: number
  name: string
  description: string
  scope: 'agent' | 'task' | 'project'
  modelOverride: string
  createdAt: string
  updatedAt: string
}

export interface HarnessProfileFull extends HarnessProfile {
  permissions: Permission[]
  hooks: Hook[]
  envVars: EnvVar[]
}

export interface Preset {
  id: string
  name: string
  description: string
  icon: string
  permissions: Permission[]
  hooks: Hook[]
  envVars: EnvVar[]
}

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<HarnessProfile[]>([])
  const presets = ref<Preset[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProfiles() {
    loading.value = true
    error.value = null
    try {
      profiles.value = await ListProfiles() ?? []
    } catch (e) {
      error.value = String(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchPresets() {
    try {
      presets.value = await GetPresets() ?? []
    } catch (e) {
      error.value = String(e)
    }
  }

  async function getProfileFull(id: number): Promise<HarnessProfileFull | null> {
    try {
      return await GetProfile(id)
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function createProfile(req: object): Promise<HarnessProfileFull | null> {
    try {
      const result = await CreateProfile(req)
      await fetchProfiles()
      return result
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function updateProfile(id: number, req: object): Promise<HarnessProfileFull | null> {
    try {
      const result = await UpdateProfile(id, req)
      await fetchProfiles()
      return result
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function deleteProfile(id: number): Promise<boolean> {
    try {
      await DeleteProfile(id)
      await fetchProfiles()
      return true
    } catch (e) {
      error.value = String(e)
      return false
    }
  }

  async function duplicateProfile(id: number, name: string): Promise<HarnessProfileFull | null> {
    try {
      const result = await DuplicateProfile(id, name)
      await fetchProfiles()
      return result
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function importPreset(presetID: string): Promise<HarnessProfileFull | null> {
    try {
      const result = await ImportPreset(presetID)
      await fetchProfiles()
      return result
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function exportProfile(id: number): Promise<string | null> {
    try {
      const dir = await OpenDirectoryPicker()
      if (!dir) return null
      await ExportProfile(id, dir)
      return dir
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function importFromSettings(): Promise<HarnessProfileFull | null> {
    try {
      const path = await OpenSettingsFilePicker()
      if (!path) return null
      const result = await ImportFromSettings(path)
      await fetchProfiles()
      return result
    } catch (e) {
      error.value = String(e)
      return null
    }
  }

  async function previewExport(id: number): Promise<string> {
    try {
      return await PreviewExport(id) ?? '{}'
    } catch (e) {
      return `// Error: ${String(e)}`
    }
  }

  return {
    profiles,
    presets,
    loading,
    error,
    fetchProfiles,
    fetchPresets,
    getProfileFull,
    createProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    importPreset,
    exportProfile,
    importFromSettings,
    previewExport,
  }
})
