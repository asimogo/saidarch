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

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Project</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Category</th>
              <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr
              v-for="p in projects"
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
              <td class="px-4 py-3 text-gray-400 text-xs">{{ formatDate(p.updated_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!projects?.length" class="p-8 text-center text-gray-400">
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

const { data: projects } = await useAsyncData('admin-project-list', () =>
  supabase
    .from('projects')
    .select('*, category:categories(name_en)')
    .order('sort_order')
    .then(({ data }) => data),
)

</script>
