<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      @keydown.escape="$emit('close')"
      @keydown.left="prev"
      @keydown.right="next"
    >
      <!-- Close button -->
      <button
        ref="closeBtn"
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Close lightbox"
        @click="$emit('close')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Navigation -->
      <button
        v-if="images.length > 1"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Previous image"
        @click="prev"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="images.length > 1"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Next image"
        @click="next"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Image -->
      <div class="max-w-[90vw] max-h-[85vh]">
        <NuxtImg
          :src="images[currentIndex].image_url"
          :alt="l(images[currentIndex], 'caption') || ''"
          class="max-w-full max-h-[85vh] object-contain"
          format="webp"
          :quality="90"
        />
      </div>

      <!-- Counter -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-small">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ProjectImage } from '~/shared/types'

const props = defineProps<{
  images: ProjectImage[]
  initialIndex?: number
}>()

defineEmits<{
  close: []
}>()

const { l } = useLocalizedField()
const currentIndex = ref(props.initialIndex || 0)
const closeBtn = ref<HTMLButtonElement>()

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Focus trap: focus close button on mount
onMounted(() => {
  closeBtn.value?.focus()
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
