import { vi } from 'vitest'

vi.mock('../../wailsjs/runtime/runtime', () => ({
  EventsOn: vi.fn(),
  EventsOff: vi.fn(),
  EventsEmit: vi.fn(),
  BrowserOpenURL: vi.fn(),
}))

vi.mock('../../wailsjs/go/main/App', () => ({
  GetAppVersion: vi.fn().mockResolvedValue('0.1.0'),
  Quit: vi.fn().mockResolvedValue(undefined),
  OpenFilePicker: vi.fn().mockResolvedValue(''),
  ListProfiles: vi.fn().mockResolvedValue([]),
  GetProfile: vi.fn().mockResolvedValue(null),
  CreateProfile: vi.fn().mockResolvedValue(null),
  UpdateProfile: vi.fn().mockResolvedValue(null),
  DeleteProfile: vi.fn().mockResolvedValue(undefined),
  DuplicateProfile: vi.fn().mockResolvedValue(null),
  GetPresets: vi.fn().mockResolvedValue([]),
  ImportPreset: vi.fn().mockResolvedValue(null),
  ExportProfile: vi.fn().mockResolvedValue(undefined),
  ImportFromSettings: vi.fn().mockResolvedValue(null),
  PreviewExport: vi.fn().mockResolvedValue('{}'),
  OpenDirectoryPicker: vi.fn().mockResolvedValue(''),
  OpenSettingsFilePicker: vi.fn().mockResolvedValue(''),
}))
