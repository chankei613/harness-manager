<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import { useI18n } from '@/i18n'

const profilesStore = useProfilesStore()
const route = useRoute()
const { t, toggleLocale } = useI18n()

onMounted(() => {
  profilesStore.fetchProfiles()
})

function isActive(prefix: string) {
  return route.path.startsWith(prefix)
}

const navItems = [
  {
    to: '/profiles',
    key: 'nav.profiles',
    icon: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>`,
  },
  {
    to: '/presets',
    key: 'nav.presets',
    icon: `<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>`,
  },
  {
    to: '/settings',
    key: 'nav.settings',
    icon: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  },
  {
    to: '/help',
    key: 'nav.help',
    icon: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
  },
]
</script>

<template>
  <div class="flex h-screen bg-background text-foreground overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-52 border-r border-border flex flex-col shrink-0 bg-background">
      <div class="px-4 pb-4 pt-16 border-b border-border" style="-webkit-app-region: drag">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <h1 class="text-sm font-semibold tracking-tight text-foreground">Harness Manager</h1>
            </div>
          </div>
          <button
            style="-webkit-app-region: no-drag"
            class="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 hover:border-gray-400 transition-colors shrink-0 mt-0.5"
            @click="toggleLocale"
          >
            {{ t('lang.toggle') }}
          </button>
        </div>
      </div>

      <nav class="flex-1 p-2 space-y-0.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors"
          :class="isActive(item.to)
            ? 'bg-gray-900 text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="item.icon" />
          <span>{{ t(item.key) }}</span>
          <span
            v-if="item.to === '/profiles' && profilesStore.profiles.length > 0"
            class="ml-auto text-xs opacity-60"
          >{{ profilesStore.profiles.length }}</span>
        </RouterLink>
      </nav>

      <div class="p-3 border-t border-border">
        <RouterLink
          to="/profiles/new"
          class="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md text-sm bg-gray-900 text-white hover:brightness-110 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {{ t('nav.newProfile') }}
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto bg-gray-50/50 flex flex-col">
      <RouterView class="flex-1" />
    </main>
  </div>
</template>
