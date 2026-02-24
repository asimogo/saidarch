<template>
  <div class="flex flex-wrap gap-3 justify-center">
    <button
      class="px-4 py-2 text-small tracking-wider uppercase border transition-colors"
      :class="!selected ? 'bg-deep-rock text-sandstone dark:bg-sandstone dark:text-deep-rock border-deep-rock dark:border-sandstone' : 'border-border-light dark:border-border-dark hover:border-bronze hover:text-bronze'"
      @click="$emit('select', null)"
    >
      {{ $t('projects.all') }}
    </button>
    <button
      v-for="cat in categories"
      :key="cat.id"
      class="px-4 py-2 text-small tracking-wider uppercase border transition-colors"
      :class="selected === cat.id ? 'bg-deep-rock text-sandstone dark:bg-sandstone dark:text-deep-rock border-deep-rock dark:border-sandstone' : 'border-border-light dark:border-border-dark hover:border-bronze hover:text-bronze'"
      @click="$emit('select', cat.id)"
    >
      {{ l(cat, 'name') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/shared/types'

defineProps<{
  categories: Category[]
  selected: string | null
}>()

defineEmits<{
  select: [id: string | null]
}>()

const { l } = useLocalizedField()
</script>
