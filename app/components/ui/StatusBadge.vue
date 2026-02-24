<template>
  <span
    class="inline-flex items-center px-3 py-1 text-xs tracking-wider uppercase border"
    :class="statusClasses[status]"
  >
    {{ $t(`status.${status}`) }}
  </span>
</template>

<script setup lang="ts">
import type { ProjectStatus } from '~/shared/types'

defineProps<{
  status: ProjectStatus
}>()

const statusClasses: Record<ProjectStatus, string> = {
  designing: 'border-blue-400/50 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  constructing: 'border-amber-400/50 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  completed: 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40',
  awarded: 'border-bronze text-bronze bg-bronze/5',
}
</script>
