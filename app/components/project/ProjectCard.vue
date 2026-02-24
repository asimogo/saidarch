<template>
  <NuxtLink
    :to="localePath(`/project/${project.slug}`)"
    class="group block"
  >
    <div class="relative overflow-hidden aspect-[4/3]">
      <NuxtImg
        v-if="project.cover_url"
        :src="project.cover_url"
        :alt="l(project, 'title')"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        format="webp"
        :quality="80"
        sizes="sm:100vw md:50vw lg:33vw"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-border-light dark:bg-border-dark flex items-center justify-center">
        <span class="block w-12 h-px bg-bronze/30" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    <div class="pt-4 space-y-1">
      <div class="flex items-center gap-2">
        <StatusBadge v-if="project.project_status && project.project_status !== 'completed'" :status="project.project_status" />
        <span v-if="project.category" class="text-xs text-subtle-light dark:text-subtle-dark uppercase tracking-wider">
          {{ l(project.category, 'name') }}
        </span>
      </div>
      <h3 class="font-heading text-xl group-hover:text-bronze transition-colors">
        {{ l(project, 'title') }}
      </h3>
      <p class="text-small text-subtle-light dark:text-subtle-dark">
        {{ [project.location, project.year].filter(Boolean).join(' · ') }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

defineProps<{
  project: ProjectWithRelations
}>()

const { l } = useLocalizedField()
const localePath = useLocalePath()
</script>
