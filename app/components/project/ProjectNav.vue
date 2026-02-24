<template>
  <section class="py-12 px-6 border-t border-border-light dark:border-border-dark">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <NuxtLink
        v-if="prevProject"
        :to="localePath(`/project/${prevProject.slug}`)"
        class="group flex items-center gap-3 hover:text-bronze transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
        </svg>
        <div class="text-right">
          <p class="text-xs uppercase tracking-wider text-subtle-light dark:text-subtle-dark">{{ $t('project.prev') }}</p>
          <p class="text-body font-heading">{{ l(prevProject, 'title') }}</p>
        </div>
      </NuxtLink>
      <div v-else />

      <NuxtLink
        :to="localePath('/projects')"
        class="text-small uppercase tracking-wider hover:text-bronze transition-colors"
      >
        {{ $t('project.viewAll') }}
      </NuxtLink>

      <NuxtLink
        v-if="nextProject"
        :to="localePath(`/project/${nextProject.slug}`)"
        class="group flex items-center gap-3 hover:text-bronze transition-colors"
      >
        <div>
          <p class="text-xs uppercase tracking-wider text-subtle-light dark:text-subtle-dark">{{ $t('project.next') }}</p>
          <p class="text-body font-heading">{{ l(nextProject, 'title') }}</p>
        </div>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
      <div v-else />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

const props = defineProps<{
  current: ProjectWithRelations
  allProjects: ProjectWithRelations[] | null
}>()

const { l } = useLocalizedField()
const localePath = useLocalePath()

const currentIdx = computed(() =>
  props.allProjects?.findIndex(p => p.id === props.current.id) ?? -1,
)

const prevProject = computed(() => {
  if (!props.allProjects || currentIdx.value <= 0) return null
  return props.allProjects[currentIdx.value - 1]
})

const nextProject = computed(() => {
  if (!props.allProjects || currentIdx.value < 0 || currentIdx.value >= props.allProjects.length - 1) return null
  return props.allProjects[currentIdx.value + 1]
})
</script>
