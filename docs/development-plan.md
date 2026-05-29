# Harness Manager — 開発計画

> 作成: 2026-05-29
> 予測開発期間: 3〜4週間

---

## Week 1-2: バックエンド基盤

- [x] プロジェクト初期化
- [ ] internal/db: HarnessProfile / Permission / Hook / EnvVar モデル
- [ ] internal/db: SQLite 初期化・マイグレーション
- [ ] internal/harness: settings.json read/write ロジック
- [ ] internal/harness: プリセット定義（readonly / backend-dev / prod-safe）
- [ ] app.go: 全バインディング実装
- [ ] go mod tidy + ビルド確認

## Week 3: フロントエンド

- [ ] frontend セットアップ（Vue 3 + Vite + UnoCSS + shadcn-vue）
- [ ] ProfileListView: プロファイル一覧 + CRUD アクション
- [ ] ProfileEditView: permissions / hooks / env / preview
- [ ] SettingsView: アプリ設定
- [ ] Wails イベント + エラーハンドリング

## Week 4: 仕上げ・配布

- [ ] インポート / エクスポート E2E テスト
- [ ] golangci-lint + eslint
- [ ] vitest ユニットテスト
- [ ] クロスプラットフォームビルド確認
- [ ] README
- [ ] GitHub Actions（test / lint / release）
- [ ] v0.1.0 GitHub Release

---

## ディレクトリ構成

```
harness-manager/
├── main.go
├── app.go            ← Wails バインディング
├── version.go
├── wails.json
├── go.mod
├── docs/
│   ├── spec.md
│   ├── tech-selection.md
│   └── development-plan.md
├── internal/
│   ├── db/
│   │   ├── models.go     ← GORM モデル定義
│   │   └── database.go   ← Init / CRUD 関数
│   └── harness/
│       ├── manager.go    ← settings.json read/write
│       └── presets.go    ← プリセット定義
└── frontend/
    └── src/
        ├── pages/
        │   ├── ProfileListView.vue
        │   ├── ProfileEditView.vue
        │   └── SettingsView.vue
        └── stores/
            └── profiles.ts
```
