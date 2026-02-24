<template>
  <div>
    <AdminHeader breadcrumb="Dashboard" />
    <div class="p-6">
      <!-- Stats grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Projects</p>
          <p class="text-2xl font-semibold">{{ stats.total }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Published</p>
          <p class="text-2xl font-semibold text-emerald-600">{{ stats.published }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Drafts</p>
          <p class="text-2xl font-semibold text-amber-600">{{ stats.drafts }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Categories</p>
          <p class="text-2xl font-semibold">{{ stats.categories }}</p>
        </div>
      </div>

      <!-- Recent projects -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="font-semibold">Recent Projects</h2>
          <NuxtLink to="/admin/projects" class="text-sm text-bronze hover:text-bronze-hover">View All →</NuxtLink>
        </div>
        <div v-if="recentProjects?.length" class="divide-y divide-gray-100 dark:divide-gray-700">
          <NuxtLink
            v-for="p in recentProjects"
            :key="p.id"
            :to="`/admin/projects/${p.id}`"
            class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="w-12 h-9 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden shrink-0">
              <NuxtImg v-if="p.cover_url" :src="p.cover_url" class="w-full h-full object-cover" :quality="30" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ p.title_zh }}</p>
              <p class="text-xs text-gray-500">{{ p.publish_status }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ formatDate(p.updated_at) }}</span>
          </NuxtLink>
        </div>
        <div v-else class="p-8 text-center text-gray-400 text-sm">
          No projects yet. <NuxtLink to="/admin/projects/new" class="text-bronze">Create one →</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/helpers'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()

const { data: projectsData } = await useAsyncData('admin-projects-stats', () =>
  supabase.from('projects').select('id, publish_status').then(({ data }) => data),
)

const { data: categoriesData } = await useAsyncData('admin-categories-count', () =>
  supabase.from('categories').select('id').then(({ data }) => data),
)

const { data: recentProjects } = await useAsyncData('admin-recent', () =>
  supabase
    .from('projects')
    .select('id, title_zh, cover_url, publish_status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)
    .then(({ data }) => data),
)

const stats = computed(() => ({
  total: projectsData.value?.length || 0,
  published: projectsData.value?.filter(p => p.publish_status === 'published').length || 0,
  drafts: projectsData.value?.filter(p => p.publish_status === 'draft').length || 0,
  categories: categoriesData.value?.length || 0,
}))
</script>
