<template>
  <div class="relative overflow-hidden" :class="aspectClass">
    <!-- Blur placeholder -->
    <div
      v-if="!loaded"
      class="absolute inset-0 bg-border-light dark:bg-border-dark animate-pulse"
    />
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="preload ? 'eager' : 'lazy'"
      :format="format"
      :quality="quality"
      :sizes="sizes"
      class="w-full h-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  aspect?: '16/9' | '4/3' | '1/1' | '3/4' | 'auto'
  preload?: boolean
  format?: string
  quality?: number
  sizes?: string
}>(), {
  alt: '',
  aspect: 'auto',
  preload: false,
  format: 'webp',
  quality: 80,
  sizes: '100vw',
})

const loaded = ref(false)

const aspectClass = computed(() => {
  const map: Record<string, string> = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/4': 'aspect-[3/4]',
    'auto': '',
  }
  return map[props.aspect] || ''
})
</script>
