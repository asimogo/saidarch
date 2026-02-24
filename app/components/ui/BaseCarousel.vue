<template>
  <div
    class="relative overflow-hidden"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Slides -->
    <div class="relative w-full h-full">
      <slot :current-index="currentIndex" />
    </div>

    <!-- Dots indicator -->
    <div v-if="showDots && total > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <button
        v-for="i in total"
        :key="i"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="currentIndex === i - 1 ? 'bg-white w-6' : 'bg-white/50'"
        :aria-label="`Go to slide ${i}`"
        :aria-current="currentIndex === i - 1"
        @click="goTo(i - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  total: number
  autoplay?: boolean
  interval?: number
  showDots?: boolean
}>(), {
  autoplay: true,
  interval: 5000,
  showDots: true,
})

const emit = defineEmits<{
  change: [index: number]
}>()

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
let touchStartX = 0
let touchDeltaX = 0

const goTo = (index: number) => {
  currentIndex.value = ((index % props.total) + props.total) % props.total
  emit('change', currentIndex.value)
  resetAutoplay()
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

const startAutoplay = () => {
  if (!props.autoplay || props.total <= 1) return
  timer = setInterval(next, props.interval)
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

// Touch handling
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
  touchDeltaX = 0
}

const onTouchMove = (e: TouchEvent) => {
  touchDeltaX = e.touches[0].clientX - touchStartX
}

const onTouchEnd = () => {
  if (Math.abs(touchDeltaX) > 50) {
    touchDeltaX > 0 ? prev() : next()
  }
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())

defineExpose({ currentIndex, goTo, next, prev })
</script>
