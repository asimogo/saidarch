<template>
  <section class="max-w-4xl mx-auto px-6 py-12">
    <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
      <div v-if="project.category">
        <p class="text-xs uppercase tracking-wider text-bronze mb-1">{{ $t('project.category') }}</p>
        <p class="text-body">{{ l(project.category, 'name') }}</p>
      </div>
      <div v-if="project.location">
        <p class="text-xs uppercase tracking-wider text-bronze mb-1">{{ $t('project.location') }}</p>
        <p class="text-body">{{ project.location }}</p>
      </div>
      <div v-if="project.area">
        <p class="text-xs uppercase tracking-wider text-bronze mb-1">{{ $t('project.area') }}</p>
        <p class="text-body">{{ project.area }}</p>
      </div>
      <div v-if="project.year">
        <p class="text-xs uppercase tracking-wider text-bronze mb-1">{{ $t('project.year') }}</p>
        <p class="text-body">{{ project.year }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

defineProps<{
  project: ProjectWithRelations
}>()

const { l } = useLocalizedField()
</script>
