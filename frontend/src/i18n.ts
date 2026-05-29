import { ref } from 'vue'

export type Locale = 'en' | 'ja'

const saved = localStorage.getItem('locale') as Locale | null
const locale = ref<Locale>(saved === 'en' || saved === 'ja' ? saved : 'en')

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'lang.toggle': 'JA',
    'nav.profiles': 'Profiles',
    'nav.presets': 'Presets',
    'nav.settings': 'Settings',
    'nav.newProfile': 'New Profile',
    'nav.help': 'Help',
    'profile.list.empty': 'No profiles yet. Create one or import from a preset.',
    'profile.list.count': '{count} profile(s)',
    'profile.delete.confirm': 'Delete "{name}"?',
    'profile.duplicate.name': '{name} (copy)',
    'settings.title': 'Settings',
    'settings.quit': 'Quit App',
    'settings.quit.confirm': 'Quit Harness Manager?',
    'export.success': 'Exported to {path}',
    'export.error': 'Export failed: {error}',
    'import.success': 'Imported "{name}"',
    'import.error': 'Import failed: {error}',
  },
  ja: {
    'lang.toggle': 'EN',
    'nav.profiles': '設定セット',
    'nav.presets': 'プリセット',
    'nav.settings': '設定',
    'nav.newProfile': '新規作成',
    'nav.help': 'ヘルプ',
    'profile.list.empty': '設定セットがありません。作成またはプリセットからインポートしてください。',
    'profile.list.count': '{count} 件',
    'profile.delete.confirm': '"{name}" を削除しますか？',
    'profile.duplicate.name': '{name} のコピー',
    'settings.title': '設定',
    'settings.quit': 'アプリを終了',
    'settings.quit.confirm': 'Harness Manager を終了しますか？',
    'export.success': '{path} にエクスポートしました',
    'export.error': 'エクスポート失敗: {error}',
    'import.success': '"{name}" をインポートしました',
    'import.error': 'インポート失敗: {error}',
  },
}

export function useI18n() {
  function t(key: string, params?: Record<string, string | number>): string {
    let msg = messages[locale.value][key] ?? messages.en[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        msg = msg.replace(`{${k}}`, String(v))
      }
    }
    return msg
  }

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'ja' : 'en'
    localStorage.setItem('locale', locale.value)
  }

  return { t, locale, toggleLocale }
}
