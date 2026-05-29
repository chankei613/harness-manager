# Harness Manager — 仕様書

> 作成: 2026-05-29
> ステータス: 設計フェーズ

---

## 1. 製品概要

**"AIのdotfiles manager"** — Claude Codeの実行権限・フック・環境変数をビジュアル管理するデスクトップツール。

### 解決する問題

Claude Code の `settings.json` は現状 JSON を手動編集する必要がある。
- どのツールが許可/拒否されているか一覧できない
- hook の設定ミスがサイレントに失敗する
- プロジェクトごとに設定を切り替える仕組みがない
- "このエージェントにはこの権限セット" を再利用できない

### ソリューション

**Harness Profile** = named な権限セット。GUI で作成・編集し、任意の `.claude/settings.json` へエクスポートする。

---

## 2. コアコンセプト

### Harness Profile
```
{
  id: string
  name: string              // "backend-dev" / "readonly" / "prod-safe"
  description: string
  scope: "agent" | "task" | "project"

  permissions: {
    allow: string[]         // ["Bash(ls*)", "Read", "mcp__supabase__execute_sql"]
    deny: string[]          // ["Bash(rm -rf*)", "Bash(git push --force*)"]
  }

  hooks: {
    PreToolUse: HookEntry[]
    PostToolUse: HookEntry[]
    Stop: HookEntry[]
    Notification: HookEntry[]
  }

  env: { key: string; value: string }[]
}

HookEntry = {
  matcher: string           // "Bash" / "Write" / "*"
  command: string           // shell command to run
  blocking: boolean         // true = block tool call on failure
  timeoutSeconds: number
}
```

### Claude Code settings.json フォーマット（エクスポート先）
```json
{
  "permissions": {
    "allow": ["Bash(ls*)", "Read"],
    "deny": ["Bash(rm -rf*)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "echo 'before bash'" }
        ]
      }
    ]
  },
  "env": {
    "MY_KEY": "value"
  }
}
```

---

## 3. 機能一覧

### Phase 1 (MVP)

| 機能 | 説明 |
|------|------|
| プロファイル一覧 | 作成済みプロファイルの CRUD |
| プロファイル編集 | permissions / hooks / env vars のビジュアル編集 |
| プリセット | readonly / backend-dev / prod-safe の初期テンプレート |
| エクスポート | 選択したディレクトリに settings.json を書き出す |
| インポート | 既存 settings.json からプロファイルを取り込む |
| プレビュー | エクスポートされる JSON をリアルタイムプレビュー |
| プロファイル複製 | 既存プロファイルをベースに新規作成 |

### Phase 2 (拡張)

| 機能 | 説明 |
|------|------|
| Autonomy Matrix 連携 | モードに応じたプロファイル自動推奨 |
| バージョン履歴 | プロファイルの変更履歴・ロールバック |
| クイック切り替え | メニューバーからプロファイルを即時適用 |

---

## 4. プリセットプロファイル

### readonly
```json
{
  "permissions": {
    "allow": ["Read", "Bash(grep*)", "Bash(find*)", "Bash(ls*)", "WebSearch", "WebFetch"],
    "deny": ["Write", "Edit", "Bash"]
  }
}
```

### backend-dev
```json
{
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Bash", "mcp__supabase__*", "mcp__github__*"],
    "deny": ["Bash(git push --force*)", "Bash(rm -rf*)"]
  }
}
```

### prod-safe
```json
{
  "permissions": {
    "allow": ["Read", "Bash(git status)", "Bash(git log*)"],
    "deny": ["Write", "Edit", "Bash"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "echo '[PROD] tool: $TOOL_NAME' >> ~/prod-audit.log" }]
      }
    ]
  }
}
```

---

## 5. UX フロー

```
起動
 └── プロファイル一覧（ProfileListView）
      ├── 新規作成 → ProfileEditView（空）
      ├── プリセットから追加 → ProfileEditView（プリセット値入り）
      ├── 既存クリック → ProfileEditView（編集）
      └── インポート → settings.json 選択 → ProfileEditView（インポート値入り）

ProfileEditView
 ├── Permissions タブ（allow / deny のリスト編集）
 ├── Hooks タブ（PreToolUse / PostToolUse / Stop / Notification）
 ├── Env Vars タブ（KEY=VALUE ペア）
 ├── Preview サイドパネル（JSON リアルタイム表示）
 └── Export ボタン → ディレクトリ選択 → settings.json 書き出し
```

---

## 6. データストア

SQLite（ローカル、`~/.harness-manager/harness.db`）

```sql
harness_profiles (id, name, description, scope, model_override, created_at, updated_at, deleted_at)
harness_permissions (id, profile_id, type [allow|deny], tool)
harness_hooks (id, profile_id, event, matcher, command, blocking, timeout_seconds, sort_order)
harness_env_vars (id, profile_id, key, value, sort_order)
```
