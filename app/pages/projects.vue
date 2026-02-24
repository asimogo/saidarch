<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="pt-12 pb-8 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="font-heading text-h1 mb-4">{{ $t('projects.title') }}</h1>
        <hr class="max-w-xs mx-auto" />
      </div>
    </section>

    <!-- Category filter -->
    <section class="px-6 pb-8">
      <div class="max-w-7xl mx-auto">
        <CategoryFilter
          v-if="categories"
          :categories="categories"
          :selected="selectedCategory"
          @select="selectedCategory = $event"
        />
      </div>
    </section>

    <!-- Project grid -->
    <section class="px-6 pb-section">
      <div class="max-w-7xl mx-auto">
        <div v-if="filteredProjects?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
          />
        </div>
        <div v-else class="text-center py-20 text-subtle-light dark:text-subtle-dark">
          <span class="block w-12 h-px bg-bronze/30 mx-auto mb-6" />
          <p class="text-body">No projects found.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

const supabase = useSupabase()

const selectedCategory = ref<string | null>(null)

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
  try {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    return data
  } catch { return null }
})

// Fetch all published projects
const { data: projects } = await useAsyncData('all-projects', async () => {
  try {
    const { data } = await supabase
      .from('projects')
      .select('*, category:categories(*)')
      .eq('publish_status', 'published')
      .order('sort_order')
    return data as ProjectWithRelations[] | null
  } catch { return null }
})

// Filtered projects
const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (!selectedCategory.value) return projects.value
  return projects.value.filter(p => p.category_id === selectedCategory.value)
})

// SEO
const { t } = useI18n()
useSeoMeta({
  title: () => `${t('projects.seoTitle')} | SAID`,
  ogTitle: () => `${t('projects.title')} | SAID`,
  description: () => t('projects.seoDescription'),
})
</script>
