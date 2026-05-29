<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfilesStore, type Permission, type Hook, type EnvVar } from '@/stores/profiles'

const route = useRoute()
const router = useRouter()
const store = useProfilesStore()

const isEdit = computed(() => route.params.id !== undefined)
const profileId = computed(() => isEdit.value ? Number(route.params.id) : null)

const name = ref('')
const description = ref('')
const scope = ref<'agent' | 'task' | 'project'>('agent')
const modelOverride = ref('')
const permissions = ref<Permission[]>([])
const hooks = ref<Hook[]>([])
const envVars = ref<EnvVar[]>([])

const activeTab = ref<'permissions' | 'hooks' | 'env'>('permissions')
const previewJSON = ref('')
const saving = ref(false)
const toast = ref<{ msg: string; type: 'success' | 'error' } | null>(null)

onMounted(async () => {
  if (profileId.value) {
    const full = await store.getProfileFull(profileId.value)
    if (full) {
      name.value = full.name
      description.value = full.description
      scope.value = full.scope
      modelOverride.value = full.modelOverride
      permissions.value = full.permissions.map(p => ({ type: p.type, tool: p.tool }))
      hooks.value = full.hooks.map(h => ({ event: h.event, matcher: h.matcher, command: h.command, blocking: h.blocking, timeoutSeconds: h.timeoutSeconds }))
      envVars.value = full.envVars.map(e => ({ key: e.key, value: e.value }))
      updatePreview()
    }
  }
})

async function updatePreview() {
  if (profileId.value) {
    previewJSON.value = await store.previewExport(profileId.value)
  } else {
    previewJSON.value = buildPreviewFromState()
  }
}

function buildPreviewFromState(): string {
  const allow = permissions.value.filter(p => p.type === 'allow').map(p => p.tool)
  const deny = permissions.value.filter(p => p.type === 'deny').map(p => p.tool)
  const obj: Record<string, unknown> = {}
  if (allow.length || deny.length) {
    obj.permissions = { ...(allow.length && { allow }), ...(deny.length && { deny }) }
  }
  const hooksByEvent: Record<string, { matcher: string; hooks: { type: string; command: string }[] }[]> = {}
  for (const h of hooks.value) {
    if (!hooksByEvent[h.event]) hooksByEvent[h.event] = []
    hooksByEvent[h.event].push({ matcher: h.matcher, hooks: [{ type: 'command', command: h.command }] })
  }
  if (Object.keys(hooksByEvent).length) obj.hooks = hooksByEvent
  if (envVars.value.length) {
    obj.env = Object.fromEntries(envVars.value.map(e => [e.key, e.value]))
  }
  return JSON.stringify(obj, null, 2)
}

watch([permissions, hooks, envVars], () => {
  if (!profileId.value) previewJSON.value = buildPreviewFromState()
}, { deep: true })

async function save() {
  if (!name.value.trim()) return
  saving.value = true
  try {
    const req = {
      name: name.value.trim(),
      description: description.value,
      scope: scope.value,
      modelOverride: modelOverride.value,
      permissions: permissions.value,
      hooks: hooks.value,
      envVars: envVars.value,
    }
    if (profileId.value) {
      await store.updateProfile(profileId.value, req)
      showToast('Saved')
      updatePreview()
    } else {
      const result = await store.createProfile(req)
      if (result) router.replace(`/profiles/${result.id}/edit`)
    }
  } finally {
    saving.value = false
  }
}

async function handleExport() {
  if (!profileId.value) { await save(); return }
  const path = await store.exportProfile(profileId.value)
  if (path) showToast(`Exported to ${path}`)
}

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3000)
}

// ─── Permissions helpers ──────────────────────────────────────────
const newPermType = ref<'allow' | 'deny'>('allow')
const newPermTool = ref('')

function addPermission() {
  if (!newPermTool.value.trim()) return
  permissions.value.push({ type: newPermType.value, tool: newPermTool.value.trim() })
  newPermTool.value = ''
}

function removePermission(index: number) {
  permissions.value.splice(index, 1)
}

// ─── Hooks helpers ────────────────────────────────────────────────
function addHook() {
  hooks.value.push({ event: 'PreToolUse', matcher: '*', command: '', blocking: false, timeoutSeconds: 30 })
}

function removeHook(index: number) {
  hooks.value.splice(index, 1)
}

// ─── EnvVar helpers ───────────────────────────────────────────────
function addEnvVar() {
  envVars.value.push({ key: '', value: '' })
}

function removeEnvVar(index: number) {
  envVars.value.splice(index, 1)
}

const hookEvents = ['PreToolUse', 'PostToolUse', 'Stop', 'Notification'] as const
</script>

<template>
  <div class="flex h-full">
    <!-- Editor panel -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
        <div class="flex items-center gap-3">
          <button @click="router.push('/profiles')"
            class="text-muted-foreground hover:text-foreground transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 class="text-base font-semibold text-foreground">
            {{ isEdit ? 'Edit Profile' : 'New Profile' }}
          </h2>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="profileId"
            @click="handleExport"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Export
          </button>
          <button
            @click="save"
            :disabled="!name.trim() || saving"
            class="px-4 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>

      <!-- Form body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Basic info -->
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 space-y-1">
            <label class="text-xs font-medium text-muted-foreground">Name *</label>
            <input
              v-model="name"
              placeholder="e.g. backend-dev"
              class="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div class="col-span-2 space-y-1">
            <label class="text-xs font-medium text-muted-foreground">Description</label>
            <input
              v-model="description"
              placeholder="What is this profile for?"
              class="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-muted-foreground">Scope</label>
            <select
              v-model="scope"
              class="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
            >
              <option value="agent">Agent</option>
              <option value="task">Task</option>
              <option value="project">Project</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-muted-foreground">Model Override <span class="opacity-50">(optional)</span></label>
            <input
              v-model="modelOverride"
              placeholder="claude-sonnet-4-6"
              class="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        </div>

        <!-- Tabs -->
        <div>
          <div class="flex gap-1 border-b border-border mb-4">
            <button
              v-for="tab in ['permissions', 'hooks', 'env'] as const"
              :key="tab"
              @click="activeTab = tab"
              class="px-3 py-2 text-sm capitalize transition-colors border-b-2 -mb-px"
              :class="activeTab === tab
                ? 'border-foreground text-foreground font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              {{ tab }}
              <span v-if="tab === 'permissions' && permissions.length > 0" class="ml-1 text-xs opacity-60">({{ permissions.length }})</span>
              <span v-if="tab === 'hooks' && hooks.length > 0" class="ml-1 text-xs opacity-60">({{ hooks.length }})</span>
              <span v-if="tab === 'env' && envVars.length > 0" class="ml-1 text-xs opacity-60">({{ envVars.length }})</span>
            </button>
          </div>

          <!-- Permissions tab -->
          <div v-if="activeTab === 'permissions'" class="space-y-3">
            <div class="flex gap-2">
              <select v-model="newPermType"
                class="px-2 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none">
                <option value="allow">allow</option>
                <option value="deny">deny</option>
              </select>
              <input
                v-model="newPermTool"
                @keydown.enter="addPermission"
                placeholder='Bash(*), Read, mcp__supabase__*'
                class="flex-1 px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20"
              />
              <button @click="addPermission"
                class="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:brightness-110 transition-colors">
                Add
              </button>
            </div>
            <div class="space-y-1.5">
              <div
                v-for="(perm, i) in permissions"
                :key="i"
                class="flex items-center gap-2 px-3 py-2 rounded-md border border-border group"
              >
                <span class="text-xs px-1.5 py-0.5 rounded font-mono"
                  :class="perm.type === 'allow' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                  {{ perm.type }}
                </span>
                <span class="flex-1 text-sm font-mono text-foreground">{{ perm.tool }}</span>
                <button @click="removePermission(i)"
                  class="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <p v-if="permissions.length === 0" class="text-xs text-muted-foreground py-2">No permissions defined. All tools use Claude Code defaults.</p>
            </div>
          </div>

          <!-- Hooks tab -->
          <div v-if="activeTab === 'hooks'" class="space-y-3">
            <button @click="addHook"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Hook
            </button>
            <div class="space-y-3">
              <div v-for="(hook, i) in hooks" :key="i"
                class="p-3 rounded-md border border-border space-y-2">
                <div class="flex items-center gap-2">
                  <select v-model="hook.event"
                    class="px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none">
                    <option v-for="ev in hookEvents" :key="ev" :value="ev">{{ ev }}</option>
                  </select>
                  <span class="text-xs text-muted-foreground">matcher:</span>
                  <input v-model="hook.matcher" placeholder="Bash / * / Write"
                    class="px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none w-28 font-mono" />
                  <label class="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <input type="checkbox" v-model="hook.blocking" class="rounded" />
                    blocking
                  </label>
                  <button @click="removeHook(i)"
                    class="text-muted-foreground hover:text-red-500 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <input v-model="hook.command" placeholder="Shell command to run"
                  class="w-full px-3 py-1.5 text-xs font-mono border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground/20" />
              </div>
              <p v-if="hooks.length === 0" class="text-xs text-muted-foreground py-2">No hooks defined.</p>
            </div>
          </div>

          <!-- Env tab -->
          <div v-if="activeTab === 'env'" class="space-y-3">
            <button @click="addEnvVar"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Variable
            </button>
            <div class="space-y-2">
              <div v-for="(env, i) in envVars" :key="i" class="flex items-center gap-2">
                <input v-model="env.key" placeholder="KEY"
                  class="w-40 px-3 py-1.5 text-xs font-mono border border-border rounded bg-background focus:outline-none uppercase" />
                <span class="text-muted-foreground text-xs">=</span>
                <input v-model="env.value" placeholder="value"
                  class="flex-1 px-3 py-1.5 text-xs font-mono border border-border rounded bg-background focus:outline-none" />
                <button @click="removeEnvVar(i)"
                  class="text-muted-foreground hover:text-red-500 transition-colors">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <p v-if="envVars.length === 0" class="text-xs text-muted-foreground py-2">No environment variables defined.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview panel -->
    <div class="w-80 shrink-0 border-l border-border flex flex-col bg-gray-50/50">
      <div class="px-4 py-3 border-b border-border shrink-0">
        <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wider">JSON Preview</h3>
        <p class="text-xs text-muted-foreground mt-0.5">settings.json output</p>
      </div>
      <pre class="flex-1 overflow-auto p-4 text-xs font-mono text-foreground whitespace-pre leading-relaxed">{{ previewJSON || '{}' }}</pre>
    </div>

    <!-- Toast -->
    <div v-if="toast"
      class="fixed bottom-4 right-4 px-4 py-2.5 rounded-lg text-sm text-white shadow-lg"
      :class="toast.type === 'error' ? 'bg-red-500' : 'bg-gray-900'">
      {{ toast.msg }}
    </div>
  </div>
</template>
