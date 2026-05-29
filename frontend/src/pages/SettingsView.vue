<script setup lang="ts">
import { ref } from 'vue'
import { Quit } from '../../wailsjs/go/main/App'

const confirmingQuit = ref(false)

async function handleQuit() {
  if (!confirmingQuit.value) {
    confirmingQuit.value = true
    setTimeout(() => { confirmingQuit.value = false }, 3000)
    return
  }
  await Quit()
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="px-6 py-4 border-b border-border bg-background shrink-0">
      <h2 class="text-base font-semibold text-foreground">Settings</h2>
    </div>

    <div class="flex-1 p-6 space-y-6">
      <section class="space-y-3">
        <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</h3>
        <div class="text-sm text-muted-foreground">
          <p>Profiles are stored locally in <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">~/.harness-manager/harness.db</code></p>
        </div>
      </section>

      <section class="space-y-3">
        <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Application</h3>
        <div>
          <button
            @click="handleQuit"
            class="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {{ confirmingQuit ? 'Click again to confirm quit' : 'Quit Harness Manager' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
