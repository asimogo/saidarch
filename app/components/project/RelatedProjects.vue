<template>
  <section v-if="relatedList?.length" class="py-section">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="font-heading text-h2 text-center mb-8">{{ $t('project.related') }}</h2>
      <hr class="max-w-xs mx-auto mb-12" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in relatedList"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

const props = defineProps<{
  current: ProjectWithRelations
  projects: ProjectWithRelations[] | null
}>()

const relatedList = computed(() => {
  if (!props.projects) return []
  return props.projects
    .filter(p => p.id !== props.current.id)
    .filter(p => p.category_id === props.current.category_id)
    .slice(0, 3)
})
</script>
