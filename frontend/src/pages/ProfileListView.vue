<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { useI18n } from '@/i18n'

const store = useProfilesStore()
const router = useRouter()
const { t } = useI18n()

const toast = ref<{ msg: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.value = { msg, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3500)
}

onMounted(() => store.fetchProfiles())

async function handleDuplicate(id: number, name: string) {
  const newName = t('profile.duplicate.name', { name })
  await store.duplicateProfile(id, newName)
}

async function handleDelete(id: number, name: string) {
  if (!confirm(t('profile.delete.confirm', { name }))) return
  const ok = await store.deleteProfile(id)
  if (!ok && store.error) showToast(store.error, 'error')
}

async function handleExport(id: number) {
  const path = await store.exportProfile(id)
  if (path) showToast(t('export.success', { path }))
  else if (store.error) showToast(t('export.error', { error: store.error }), 'error')
}

async function handleImport() {
  const result = await store.importFromSettings()
  if (result) showToast(t('import.success', { name: result.name }))
  else if (store.error) showToast(t('import.error', { error: store.error }), 'error')
}

const scopeLabel: Record<string, string> = {
  agent: 'agent',
  task: 'task',
  project: 'project',
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-foreground">Harness Profiles</h2>
        <span v-if="store.profiles.length > 0" class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {{ store.profiles.length }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          @click="handleImport"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Import settings.json
        </button>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:brightness-110 transition-colors"
          @click="router.push('/profiles/new')"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Profile
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Loading -->
      <div v-if="store.loading" class="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Loading...
      </div>

      <!-- Empty -->
      <div
        v-else-if="store.profiles.length === 0"
        class="flex flex-col items-center justify-center h-64 gap-3 text-center"
      >
        <svg class="w-12 h-12 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p class="text-sm text-muted-foreground max-w-xs">{{ t('profile.list.empty') }}</p>
        <div class="flex gap-2 mt-1">
          <button
            class="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:brightness-110 transition-colors"
            @click="router.push('/profiles/new')"
          >
            Create Profile
          </button>
          <button
            class="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted transition-colors"
            @click="router.push('/presets')"
          >
            Browse Presets
          </button>
        </div>
      </div>

      <!-- Profile cards -->
      <div v-else class="grid gap-3">
        <div
          v-for="profile in store.profiles"
          :key="profile.id"
          class="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:border-foreground/20 transition-colors group"
        >
          <div class="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm text-foreground truncate">{{ profile.name }}</span>
              <span class="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{{ scopeLabel[profile.scope] ?? profile.scope }}</span>
            </div>
            <p v-if="profile.description" class="text-xs text-muted-foreground mt-0.5 line-clamp-1">{{ profile.description }}</p>
          </div>

          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              class="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edit"
              @click="router.push(`/profiles/${profile.id}/edit`)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              class="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Export to settings.json"
              @click="handleExport(profile.id)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
            <button
              class="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Duplicate"
              @click="handleDuplicate(profile.id, profile.name)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              class="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
              @click="handleDelete(profile.id, profile.name)"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed bottom-4 right-4 px-4 py-2.5 rounded-lg text-sm shadow-lg transition-all"
      :class="toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'"
    >
      {{ toast.msg }}
    </div>
  </div>
</template>
