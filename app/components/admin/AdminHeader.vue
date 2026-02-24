<template>
  <header class="h-14 border-b border-border-light bg-white dark:border-border-dark dark:bg-deep-rock-soft flex items-center justify-between px-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center text-sm">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <span v-if="index > 0" class="mx-2 text-subtle-light dark:text-subtle-dark">/</span>
        <NuxtLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="text-subtle-light dark:text-subtle-dark hover:text-bronze transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          class="text-deep-rock dark:text-sandstone font-medium"
        >
          {{ crumb.label }}
        </span>
      </template>
    </nav>

    <!-- User Info -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-subtle-light dark:text-subtle-dark">
        {{ userEmail }}
      </span>
      <div class="w-8 h-8 rounded-full bg-bronze/10 text-bronze flex items-center justify-center text-xs font-semibold uppercase">
        {{ userInitial }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const supabase = useSupabase()

interface Breadcrumb {
  label: string
  path: string
}

const userEmail = ref('')
const userInitial = computed(() => userEmail.value?.charAt(0)?.toUpperCase() || 'A')

// Fetch user session
onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  userEmail.value = data.session?.user?.email || ''
})

// Mapping for readable breadcrumb labels
const labelMap: Record<string, string> = {
  admin: 'Dashboard',
  settings: 'Settings',
  hero: 'Hero',
  projects: 'Projects',
  categories: 'Categories',
  translation: 'Translation',
  edit: 'Edit',
  new: 'New',
}

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    const label = labelMap[segment] || segment
    return { label, path }
  })
})
</script>
