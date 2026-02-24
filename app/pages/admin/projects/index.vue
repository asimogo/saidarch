<template>
  <div>
    <AdminHeader breadcrumb="Projects" />
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-lg font-semibold">Projects</h1>
        <NuxtLink
          to="/admin/projects/new"
          class="px-4 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors"
        >
          + New Project
        </NuxtLink>
      </div>

      <!-- Filter -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="f in filters"
          :key="f.value"
          class="px-3 py-1 text-xs border rounded transition-colors"
          :class="filter === f.value ? 'bg-bronze text-white border-bronze' : 'border-gray-300 dark:border-gray-600'"
          @click="filter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Project</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Category</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Status</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Publish</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr
              v-for="p in filteredProjects"
              :key="p.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              @click="navigateTo(`/admin/projects/${p.id}`)"
            >
              <td class="px-4 py-3 flex items-center gap-3">
                <div class="w-10 h-7 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden shrink-0">
                  <NuxtImg v-if="p.cover_url" :src="p.cover_url" class="w-full h-full object-cover" :quality="20" />
                </div>
                <span class="font-medium truncate max-w-[200px]">{{ p.title_zh }}</span>
              </td>
              <td class="px-4 py-3 text-gray-500">{{ p.category?.name_en || '-' }}</td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded" :class="statusColor(p.project_status)">
                  {{ p.project_status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="text-xs px-2 py-0.5 rounded" :class="publishColor(p.publish_status)">
                  {{ p.publish_status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-400 text-xs">{{ formatDate(p.updated_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!filteredProjects?.length" class="p-8 text-center text-gray-400">
          No projects found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/helpers'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()
const filter = ref('all')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

const { data: projects } = await useAsyncData('admin-project-list', () =>
  supabase
    .from('projects')
    .select('*, category:categories(name_en)')
    .order('sort_order')
    .then(({ data }) => data),
)

const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (filter.value === 'all') return projects.value
  return projects.value.filter(p => p.publish_status === filter.value)
})

const statusColor = (s: string | null) => ({
  'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': s === 'designing',
  'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400': s === 'constructing',
  'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400': s === 'completed',
  'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400': s === 'awarded',
})

const publishColor = (s: string) => ({
  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300': s === 'draft',
  'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400': s === 'published',
  'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400': s === 'archived',
})
</script>
