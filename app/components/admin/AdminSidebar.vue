<template>
  <aside class="fixed left-0 top-0 h-screen w-60 border-r border-border-light bg-white dark:border-border-dark dark:bg-deep-rock-soft flex flex-col z-40">
    <!-- Logo -->
    <div class="flex items-center gap-2 px-5 py-5 border-b border-border-light dark:border-border-dark">
      <span class="text-xl font-heading font-semibold tracking-wide text-deep-rock dark:text-sandstone">
        SAID
      </span>
      <span class="text-xs uppercase tracking-widest text-subtle-light dark:text-subtle-dark">
        Admin
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <ul class="space-y-1">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200"
            :class="isActive(link.to)
              ? 'bg-bronze/10 text-bronze'
              : 'text-subtle-light dark:text-subtle-dark hover:bg-sandstone dark:hover:bg-deep-rock hover:text-deep-rock dark:hover:text-sandstone'"
          >
            <component :is="link.icon" class="w-5 h-5" />
            <span>{{ link.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Logout & Theme Toggle -->
    <div class="p-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
      <button
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-subtle-light dark:text-subtle-dark hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors duration-200"
        @click="handleLogout"
      >
        <LogoutIcon class="w-5 h-5" />
        <span>退出登录</span>
      </button>
      <ThemeToggle />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'

const route = useRoute()
const router = useRouter()
const supabase = useSupabase()

// SVG icon helper
function createIcon(pathD: string): FunctionalComponent {
  return () =>
    h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5', d: pathD }),
    ])
}

const DashboardIcon = createIcon('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1')
const SettingsIcon = createIcon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z')
const HeroIcon = createIcon('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z')
const ProjectsIcon = createIcon('M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10')
const CategoriesIcon = createIcon('M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z')
const TranslationIcon = createIcon('M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129')
const LogoutIcon = createIcon('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1')

interface NavLink {
  to: string
  label: string
  icon: FunctionalComponent
}

const navLinks: NavLink[] = [
  { to: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/admin/hero', label: 'Hero', icon: HeroIcon },
  { to: '/admin/projects', label: 'Projects', icon: ProjectsIcon },
  { to: '/admin/categories', label: 'Categories', icon: CategoriesIcon },
  { to: '/admin/translation', label: 'Translation', icon: TranslationIcon },
]

function isActive(to: string): boolean {
  if (to === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(to)
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>
