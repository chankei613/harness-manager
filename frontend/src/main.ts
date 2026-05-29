import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import './assets/globals.css'
import App from './App.vue'
import ProfileListView from './pages/ProfileListView.vue'
import ProfileEditView from './pages/ProfileEditView.vue'
import PresetsView from './pages/PresetsView.vue'
import SettingsView from './pages/SettingsView.vue'
import HelpView from './pages/HelpView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/profiles' },
    { path: '/profiles', component: ProfileListView },
    { path: '/profiles/new', component: ProfileEditView },
    { path: '/profiles/:id/edit', component: ProfileEditView },
    { path: '/presets', component: PresetsView },
    { path: '/settings', component: SettingsView },
    { path: '/help', component: HelpView },
  ],
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
