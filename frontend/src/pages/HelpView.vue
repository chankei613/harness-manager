<script setup lang="ts">
import { ref } from 'vue'

const sections = [
  { id: 'what', label: 'Harness とは' },
  { id: 'profile', label: 'プロファイルを作る' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'env', label: 'Env Vars' },
  { id: 'export', label: 'Export' },
  { id: 'import', label: 'Import' },
  { id: 'presets', label: 'プリセット' },
]

const active = ref('what')

function scrollTo(id: string) {
  active.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <!-- ToC -->
    <aside class="w-44 shrink-0 border-r border-border p-4 pt-6 space-y-0.5 overflow-y-auto">
      <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">目次</p>
      <button
        v-for="s in sections"
        :key="s.id"
        @click="scrollTo(s.id)"
        class="w-full text-left px-2 py-1.5 rounded text-xs transition-colors"
        :class="active === s.id ? 'bg-gray-900 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
      >{{ s.label }}</button>
    </aside>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-10 py-8 space-y-12 max-w-2xl" @scroll.passive>

      <!-- What is Harness -->
      <section id="what" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Harness とは
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Claude Code の <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">.claude/settings.json</code> に書く
          「AIが何のツールを使えるか」「フック」「環境変数」をまとめた設定セットです。
          Harness Manager では複数の設定を <strong>プロファイル</strong> として保存・管理し、
          任意のプロジェクトにワンクリックでエクスポートできます。
        </p>
        <div class="bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground leading-relaxed">
          ~/.claude/settings.json<br/>
          &nbsp;&nbsp;└── permissions (allow / deny)<br/>
          &nbsp;&nbsp;└── hooks (PreToolUse / PostToolUse / ...)<br/>
          &nbsp;&nbsp;└── env vars
        </div>
      </section>

      <!-- Create Profile -->
      <section id="profile" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          プロファイルを作る
        </h2>
        <ol class="text-sm text-muted-foreground space-y-2 list-none">
          <li class="flex gap-3">
            <span class="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>サイドバーの <strong class="text-foreground">New Profile</strong> ボタンをクリック、またはプリセットから <strong class="text-foreground">Use</strong> で開始</span>
          </li>
          <li class="flex gap-3">
            <span class="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span><strong class="text-foreground">Name</strong>（必須）と Description を入力。Scope はデフォルト <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">agent</code> のままでOK</span>
          </li>
          <li class="flex gap-3">
            <span class="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Permissions / Hooks / Env タブで設定を追加</span>
          </li>
          <li class="flex gap-3">
            <span class="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
            <span><strong class="text-foreground">Save</strong> → <strong class="text-foreground">Export</strong> でフォルダを選んで書き出し</span>
          </li>
        </ol>
      </section>

      <!-- Permissions -->
      <section id="permissions" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Permissions
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          ツールの許可（<span class="text-green-700 font-medium">allow</span>）または拒否（<span class="text-red-600 font-medium">deny</span>）を定義します。
          パターンにはワイルドカード <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">*</code> が使えます。
        </p>
        <div class="space-y-2 text-xs">
          <div class="flex gap-2 items-start p-3 rounded-lg border border-border">
            <span class="bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono shrink-0">allow</span>
            <div>
              <p class="font-mono text-foreground">Bash(*)</p>
              <p class="text-muted-foreground mt-0.5">Bash コマンドをすべて許可</p>
            </div>
          </div>
          <div class="flex gap-2 items-start p-3 rounded-lg border border-border">
            <span class="bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono shrink-0">allow</span>
            <div>
              <p class="font-mono text-foreground">mcp__supabase__*</p>
              <p class="text-muted-foreground mt-0.5">supabase MCP の全ツールを許可</p>
            </div>
          </div>
          <div class="flex gap-2 items-start p-3 rounded-lg border border-border">
            <span class="bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-mono shrink-0">deny</span>
            <div>
              <p class="font-mono text-foreground">Bash(git push --force*)</p>
              <p class="text-muted-foreground mt-0.5">force push だけをブロック</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Hooks -->
      <section id="hooks" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
          </svg>
          Hooks
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          ツール実行の前後にシェルコマンドを差し込めます。
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 rounded-lg border border-border space-y-1">
            <p class="font-medium text-foreground">PreToolUse</p>
            <p class="text-muted-foreground">ツール実行直前。<code class="font-mono bg-muted px-0.5 rounded">blocking: true</code> にするとコマンド失敗時にツールをキャンセル</p>
          </div>
          <div class="p-3 rounded-lg border border-border space-y-1">
            <p class="font-medium text-foreground">PostToolUse</p>
            <p class="text-muted-foreground">ツール実行直後。結果ログや通知に使う</p>
          </div>
          <div class="p-3 rounded-lg border border-border space-y-1">
            <p class="font-medium text-foreground">Stop</p>
            <p class="text-muted-foreground">AIセッション終了時のクリーンアップ処理</p>
          </div>
          <div class="p-3 rounded-lg border border-border space-y-1">
            <p class="font-medium text-foreground">Notification</p>
            <p class="text-muted-foreground">通知イベント発生時に実行</p>
          </div>
        </div>
        <div class="bg-muted/50 rounded-lg p-3 text-xs">
          <p class="text-muted-foreground mb-1">使用例 — 全ツール実行を監査ログに記録:</p>
          <p class="font-mono text-foreground">matcher: *</p>
          <p class="font-mono text-foreground">command: echo "[$(date)] $TOOL_NAME" &gt;&gt; ~/audit.log</p>
        </div>
      </section>

      <!-- Env Vars -->
      <section id="env" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7h16M4 12h16M4 17h7"/>
          </svg>
          Env Vars
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          AIセッション実行時に注入される環境変数を定義します。
          APIキーなどの機密値は直接書かず、<code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">env:VAR_NAME</code> 形式で参照することを推奨します。
        </p>
      </section>

      <!-- Export -->
      <section id="export" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Export
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          プロファイル編集画面の <strong class="text-foreground">Export</strong> ボタンを押すとフォルダ選択ダイアログが開き、
          選んだフォルダに <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">settings.json</code> を書き出します。
        </p>
        <div class="text-xs space-y-1 text-muted-foreground">
          <p><strong class="text-foreground">グローバル設定に適用:</strong> <code class="font-mono bg-muted px-1 py-0.5 rounded">~/.claude/</code> を選択</p>
          <p><strong class="text-foreground">プロジェクト固有:</strong> プロジェクトの <code class="font-mono bg-muted px-1 py-0.5 rounded">.claude/</code> フォルダを選択</p>
        </div>
        <p class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          既存の settings.json は上書きされます。事前に手動バックアップを推奨します。
        </p>
      </section>

      <!-- Import -->
      <section id="import" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          プロファイル一覧の <strong class="text-foreground">Import settings.json</strong> ボタンからファイルを選ぶと、
          既存の settings.json を新しいプロファイルとして取り込めます。
          プロファイル名はファイルが入っているフォルダ名が使われます。
        </p>
      </section>

      <!-- Presets -->
      <section id="presets" class="space-y-3">
        <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
          <svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          プリセット
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          よく使う設定パターンをプリセットとして用意しています。サイドバーの Presets から <strong class="text-foreground">Use</strong> をクリックするとプロファイルとして追加されます。
        </p>
        <div class="space-y-2 text-xs">
          <div class="p-3 rounded-lg border border-border flex gap-3">
            <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-foreground">Read Only</p>
              <p class="text-muted-foreground">読み取り専用。ファイル書き込み・破壊的コマンド不可</p>
            </div>
          </div>
          <div class="p-3 rounded-lg border border-border flex gap-3">
            <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-foreground">Backend Dev</p>
              <p class="text-muted-foreground">フル開発権限。force push と rm -rf のみブロック</p>
            </div>
          </div>
          <div class="p-3 rounded-lg border border-border flex gap-3">
            <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-foreground">Prod Safe</p>
              <p class="text-muted-foreground">読み取り専用 + 全ツール呼び出しを監査ログに記録</p>
            </div>
          </div>
          <div class="p-3 rounded-lg border border-border flex gap-3">
            <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-foreground">Full Auto</p>
              <p class="text-muted-foreground">最大自律権限。壊滅的操作（rm -rf / や force push）のみブロック</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
