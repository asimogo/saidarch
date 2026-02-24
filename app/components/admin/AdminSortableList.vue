<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in internalItems"
      :key="item.id"
      class="flex items-center gap-3 rounded-md border transition-all duration-200"
      :class="dragIndex === index
        ? 'border-bronze bg-bronze/5 opacity-50'
        : dragOverIndex === index
          ? 'border-bronze border-dashed bg-bronze/5'
          : 'border-border-light dark:border-border-dark bg-white dark:bg-deep-rock-soft'"
      draggable="true"
      @dragstart="handleDragStart(index)"
      @dragover.prevent="handleDragOver(index)"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop(index)"
      @dragend="handleDragEnd"
    >
      <!-- Drag Handle -->
      <div
        class="flex-shrink-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-subtle-light dark:text-subtle-dark hover:text-bronze py-3"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      <!-- Slot Content -->
      <div class="flex-1 min-w-0 py-2 pr-3">
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SortableItem {
  id: string
  sort_order: number
  [key: string]: any
}

interface Props {
  items: SortableItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reorder: [items: SortableItem[]]
}>()

const internalItems = ref<SortableItem[]>([])
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// Sync internal items when props change
watch(
  () => props.items,
  (newItems) => {
    internalItems.value = [...newItems]
  },
  { immediate: true, deep: true },
)

function handleDragStart(index: number) {
  dragIndex.value = index
}

function handleDragOver(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  dragOverIndex.value = index
}

function handleDragLeave() {
  dragOverIndex.value = null
}

function handleDrop(targetIndex: number) {
  if (dragIndex.value === null || dragIndex.value === targetIndex) return

  const items = [...internalItems.value]
  const [movedItem] = items.splice(dragIndex.value, 1)
  items.splice(targetIndex, 0, movedItem)

  // Reassign sort_order based on new positions
  const reordered = items.map((item, i) => ({
    ...item,
    sort_order: i,
  }))

  internalItems.value = reordered
  emit('reorder', reordered)

  dragIndex.value = null
  dragOverIndex.value = null
}

function handleDragEnd() {
  dragIndex.value = null
  dragOverIndex.value = null
}
</script>
