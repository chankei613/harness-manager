# Harness Manager — 技術選定

> 作成: 2026-05-29

---

## 確定スタック

| レイヤー | 選択 | 理由 |
|---------|------|------|
| Desktop framework | Wails v2 | 既存製品（A/B）と統一。シングルバイナリ配布 |
| Backend | Go 1.22+ | Wails 本体。ファイルIO・JSON 操作が得意 |
| ORM | GORM + SQLite | 既存製品と統一。ローカルファーストで十分 |
| Frontend | Vue 3 + Vite | 既存製品と統一 |
| State | Pinia | 既存製品と統一 |
| Styling | UnoCSS + shadcn-vue | 既存製品と統一 |
| 配布 | `.app` / `.exe` | Wails クロスプラットフォームビルド |

---

## 採用しなかった選択肢

### Electron
- バイナリサイズが大きい（100MB+）
- Go との連携が不自然

### ファイルシステムのみ（DB なし）
- プロファイルの複製・バージョン管理が困難
- SQLite を使う方がシンプルかつ拡張しやすい

---

## Go パッケージ

```
gorm.io/gorm                     ORM
gorm.io/driver/sqlite            SQLite ドライバ
github.com/wailsapp/wails/v2     Wails フレームワーク
```

## Frontend パッケージ

```
@vueuse/core                     composable utilities
vue-router                       SPA ルーティング
pinia                            状態管理
@unocss/vite                     ユーティリティCSS
shadcn-vue                       UIコンポーネント
```
