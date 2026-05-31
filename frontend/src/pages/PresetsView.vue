<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfilesStore, type Preset } from '@/stores/profiles'

const store = useProfilesStore()
const router = useRouter()
const toast = ref<{ msg: string; type: 'success' | 'error' } | null>(null)

const iconPaths: Record<string, string> = {
  eye: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  terminal: `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>`,
  shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
}

onMounted(() => store.fetchPresets())

async function importPreset(preset: Preset) {
  const result = await store.importPreset(preset.id)
  if (result) {
    toast.value = { msg: `"${result.name}" added to profiles`, type: 'success' }
    setTimeout(() => { toast.value = null }, 3000)
    router.push(`/profiles/${result.id}/edit`)
  } else if (store.error) {
    toast.value = { msg: store.error, type: 'error' }
    setTimeout(() => { toast.value = null }, 3000)
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
      <div>
        <h2 class="text-base font-semibold text-foreground">Presets</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Starter profiles for common use cases</p>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid gap-3">
        <div
          v-for="preset in store.presets"
          :key="preset.id"
          class="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:border-foreground/20 transition-colors"
        >
          <div class="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" v-html="iconPaths[preset.icon] ?? iconPaths.shield" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="font-medium text-sm text-foreground">{{ preset.name }}</div>
            <p class="text-xs text-muted-foreground mt-0.5">{{ preset.description }}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="perm in preset.permissions.slice(0, 4)"
                :key="perm.tool"
                class="text-xs px-1.5 py-0.5 rounded font-mono"
                :class="perm.type === 'allow' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
              >{{ perm.tool }}</span>
              <span
                v-if="preset.permissions.length > 4"
                class="text-xs text-muted-foreground px-1.5 py-0.5"
              >+{{ preset.permissions.length - 4 }} more</span>
            </div>
          </div>

          <button
            class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            @click="importPreset(preset)"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Use
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="toast"
      class="fixed bottom-4 right-4 px-4 py-2.5 rounded-lg text-sm text-white shadow-lg"
      :class="toast.type === 'error' ? 'bg-red-500' : 'bg-gray-900'"
    >
      {{ toast.msg }}
    </div>
  </div>
</template>
