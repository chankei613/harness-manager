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
    'profile.list.title': 'Harness Profiles',
    'profile.list.import': 'Import settings.json',
    'profile.list.create': 'Create Profile',
    'profile.list.browse': 'Browse Presets',
    'profile.list.empty': 'No profiles yet. Create one or import from a preset.',
    'profile.list.loading': 'Loading...',
    'profile.list.count': '{count} profile(s)',
    'profile.delete.confirm': 'Delete "{name}"?',
    'profile.duplicate.name': '{name} (copy)',
    'scope.agent': 'agent',
    'scope.task': 'task',
    'scope.project': 'project',
    'edit.title.new': 'New Profile',
    'edit.title.edit': 'Edit Profile',
    'edit.label.name': 'Name',
    'edit.label.description': 'Description',
    'edit.label.scope': 'Scope',
    'edit.label.model': 'Model Override',
    'edit.label.modelOptional': '(optional)',
    'edit.tab.permissions': 'permissions',
    'edit.tab.hooks': 'hooks',
    'edit.tab.env': 'env',
    'edit.btn.add': 'Add',
    'edit.btn.addHook': 'Add Hook',
    'edit.btn.addVar': 'Add Variable',
    'edit.btn.export': 'Export',
    'edit.btn.save': 'Save',
    'edit.btn.saving': 'Saving...',
    'edit.empty.permissions': 'No permissions defined. All tools use Claude Code defaults.',
    'edit.empty.hooks': 'No hooks defined.',
    'edit.empty.env': 'No environment variables defined.',
    'edit.preview.title': 'JSON Preview',
    'edit.preview.subtitle': 'settings.json output',
    'edit.hook.blocking': 'blocking',
    'edit.saved': 'Saved',
    'edit.exported': 'Exported to {path}',
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
    'nav.profiles': 'パッケージ',
    'nav.presets': 'プリセット',
    'nav.settings': '設定',
    'nav.newProfile': '新規作成',
    'nav.help': 'ヘルプ',
    'profile.list.title': 'パッケージ',
    'profile.list.import': 'settings.json を読み込む',
    'profile.list.create': 'パッケージを作成',
    'profile.list.browse': 'プリセットを見る',
    'profile.list.empty': 'パッケージがありません。作成またはプリセットからインポートしてください。',
    'profile.list.loading': '読み込み中...',
    'profile.list.count': '{count} 件',
    'profile.delete.confirm': '"{name}" を削除しますか？',
    'profile.duplicate.name': '{name} のコピー',
    'scope.agent': 'エージェント',
    'scope.task': 'タスク',
    'scope.project': 'プロジェクト',
    'edit.title.new': '新規プロファイル',
    'edit.title.edit': 'プロファイルを編集',
    'edit.label.name': '名前',
    'edit.label.description': '説明',
    'edit.label.scope': 'スコープ',
    'edit.label.model': 'モデル指定',
    'edit.label.modelOptional': '（任意）',
    'edit.tab.permissions': '権限',
    'edit.tab.hooks': 'フック',
    'edit.tab.env': '環境変数',
    'edit.btn.add': '追加',
    'edit.btn.addHook': 'フックを追加',
    'edit.btn.addVar': '変数を追加',
    'edit.btn.export': 'エクスポート',
    'edit.btn.save': '保存',
    'edit.btn.saving': '保存中...',
    'edit.empty.permissions': '権限が未設定です。すべてのツールは Claude Code のデフォルト設定を使用します。',
    'edit.empty.hooks': 'フックが未設定です。',
    'edit.empty.env': '環境変数が未設定です。',
    'edit.preview.title': 'JSON プレビュー',
    'edit.preview.subtitle': 'settings.json 出力',
    'edit.hook.blocking': 'ブロッキング',
    'edit.saved': '保存しました',
    'edit.exported': '{path} にエクスポートしました',
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
