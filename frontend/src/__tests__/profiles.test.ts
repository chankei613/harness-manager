import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfilesStore } from '../stores/profiles'

// Wails Go bindings mock
vi.mock('../../wailsjs/go/main/App', () => ({
  ListProfiles: vi.fn(),
  GetProfile: vi.fn(),
  CreateProfile: vi.fn(),
  UpdateProfile: vi.fn(),
  DeleteProfile: vi.fn(),
  DuplicateProfile: vi.fn(),
  GetPresets: vi.fn(),
  ImportPreset: vi.fn(),
  ExportProfile: vi.fn(),
  ImportFromSettings: vi.fn(),
  PreviewExport: vi.fn(),
  OpenDirectoryPicker: vi.fn(),
  OpenSettingsFilePicker: vi.fn(),
}))

import * as App from '../../wailsjs/go/main/App'

const mockProfile = {
  id: 1,
  name: 'Test Profile',
  description: 'desc',
  scope: 'agent' as const,
  modelOverride: '',
  createdAt: '',
  updatedAt: '',
  permissions: [],
  hooks: [],
  envVars: [],
}

describe('useProfilesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const store = useProfilesStore()
    expect(store.profiles).toEqual([])
    expect(store.presets).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchProfiles — sets profiles on success', async () => {
    vi.mocked(App.ListProfiles).mockResolvedValue([mockProfile])

    const store = useProfilesStore()
    await store.fetchProfiles()

    expect(store.profiles).toHaveLength(1)
    expect(store.profiles[0].name).toBe('Test Profile')
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchProfiles — sets error on failure', async () => {
    vi.mocked(App.ListProfiles).mockRejectedValue(new Error('db error'))

    const store = useProfilesStore()
    await store.fetchProfiles()

    expect(store.profiles).toEqual([])
    expect(store.error).toBe('Error: db error')
  })

  it('fetchPresets — populates presets', async () => {
    const preset = {
      id: 'readonly',
      name: 'Read Only',
      description: '',
      icon: 'eye',
      permissions: [],
      hooks: [],
      envVars: [],
    }
    vi.mocked(App.GetPresets).mockResolvedValue([preset])

    const store = useProfilesStore()
    await store.fetchPresets()

    expect(store.presets).toHaveLength(1)
    expect(store.presets[0].id).toBe('readonly')
  })

  it('createProfile — refreshes list after creation', async () => {
    vi.mocked(App.CreateProfile).mockResolvedValue(mockProfile)
    vi.mocked(App.ListProfiles).mockResolvedValue([mockProfile])

    const store = useProfilesStore()
    const result = await store.createProfile({ name: 'Test Profile', scope: 'agent' })

    expect(result).not.toBeNull()
    expect(App.CreateProfile).toHaveBeenCalledTimes(1)
    expect(App.ListProfiles).toHaveBeenCalledTimes(1)
  })

  it('deleteProfile — refreshes list after delete', async () => {
    vi.mocked(App.DeleteProfile).mockResolvedValue(undefined)
    vi.mocked(App.ListProfiles).mockResolvedValue([])

    const store = useProfilesStore()
    const ok = await store.deleteProfile(1)

    expect(ok).toBe(true)
    expect(App.DeleteProfile).toHaveBeenCalledWith(1)
    expect(App.ListProfiles).toHaveBeenCalledTimes(1)
  })

  it('deleteProfile — returns false on error', async () => {
    vi.mocked(App.DeleteProfile).mockRejectedValue(new Error('not found'))

    const store = useProfilesStore()
    const ok = await store.deleteProfile(99)

    expect(ok).toBe(false)
    expect(store.error).toBeTruthy()
  })

  it('previewExport — returns JSON string', async () => {
    vi.mocked(App.PreviewExport).mockResolvedValue('{"permissions":null}')

    const store = useProfilesStore()
    const result = await store.previewExport(1)

    expect(result).toBe('{"permissions":null}')
  })

  it('previewExport — returns error string on failure', async () => {
    vi.mocked(App.PreviewExport).mockRejectedValue(new Error('failed'))

    const store = useProfilesStore()
    const result = await store.previewExport(1)

    expect(result).toMatch(/Error:/)
  })

  it('exportProfile — returns null when no directory picked', async () => {
    vi.mocked(App.OpenDirectoryPicker).mockResolvedValue('')

    const store = useProfilesStore()
    const result = await store.exportProfile(1)

    expect(result).toBeNull()
    expect(App.ExportProfile).not.toHaveBeenCalled()
  })

  it('importFromSettings — returns null when no file picked', async () => {
    vi.mocked(App.OpenSettingsFilePicker).mockResolvedValue('')

    const store = useProfilesStore()
    const result = await store.importFromSettings()

    expect(result).toBeNull()
    expect(App.ImportFromSettings).not.toHaveBeenCalled()
  })
})
