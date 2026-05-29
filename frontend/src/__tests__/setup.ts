import { vi } from 'vitest'

// Wails ランタイムのモック — テスト環境では no-op
vi.mock('../../wailsjs/runtime/runtime', () => ({
  EventsOn: vi.fn(),
  EventsOff: vi.fn(),
  EventsEmit: vi.fn(),
  BrowserOpenURL: vi.fn(),
}))

// TODO: アプリ固有の Go バインディングモックをここに追加する
vi.mock('../../wailsjs/go/main/App', () => ({
  GetAppVersion: vi.fn().mockResolvedValue('0.1.0'),
  Quit: vi.fn().mockResolvedValue(undefined),
  OpenFilePicker: vi.fn().mockResolvedValue(''),
}))
