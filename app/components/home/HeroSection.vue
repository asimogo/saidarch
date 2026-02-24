<template>
  <section id="hero" ref="heroRef" class="relative h-[100svh] md:h-screen -mt-16 overflow-hidden">
    <BaseCarousel
      :total="slides?.length || 0"
      :autoplay="true"
      :interval="6000"
      :show-arrows="(slides?.length || 0) > 1"
      class="h-full"
      @change="onSlideChange"
    >
      <template #default="{ currentIndex }">
        <div
          v-for="(slide, i) in slides"
          :key="slide.id"
          class="absolute inset-0 overflow-hidden transition-opacity duration-1000"
          :class="i === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <NuxtImg
            :src="slide.image_url"
            :alt="l(slide, 'title') || 'SAID Architecture'"
            class="hero-slide-img absolute inset-0 w-full h-full object-cover object-center"
            fit="cover"
            position="center"
            :preload="i === 0"
            :loading="i === 0 ? 'eager' : 'lazy'"
            format="webp"
            :quality="85"
            sizes="100vw"
          />
          <!-- Dark overlay -->
          <div class="absolute inset-0 bg-black/40" />
        </div>
      </template>
    </BaseCarousel>

    <!-- Content overlay -->
    <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6">
      <h1 v-if="currentSlide" class="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4">
        {{ l(currentSlide, 'title') }}
      </h1>
      <p v-if="currentSlide" class="text-lg md:text-xl font-light tracking-wide mb-8 max-w-2xl opacity-90">
        {{ l(currentSlide, 'subtitle') }}
      </p>
      <div class="flex gap-4">
        <BaseButton variant="primary" size="md" :to="currentSlide?.cta_link || localePath('/projects')">
          {{ l(currentSlide, 'cta_text') || $t('hero.viewProjects') }}
        </BaseButton>
        <BaseButton variant="outline" size="md" to="#contact" class="border-white text-white hover:bg-white hover:text-deep-rock">
          {{ $t('hero.contactUs') }}
        </BaseButton>
      </div>
    </div>

    <!-- Scroll down indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroSlide } from '~/shared/types'

const props = defineProps<{
  slides: HeroSlide[] | null
}>()

const { l } = useLocalizedField()
const localePath = useLocalePath()
const { kenBurns } = useAnimation()

const heroRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const currentSlide = computed(() => props.slides?.[currentIndex.value] || null)

const applyKenBurns = (index: number) => {
  if (!heroRef.value) return
  const images = heroRef.value.querySelectorAll<HTMLImageElement>('.hero-slide-img')
  images.forEach((img, i) => {
    if (i === index) kenBurns(img)
  })
}

const onSlideChange = (index: number) => {
  currentIndex.value = index
  nextTick(() => applyKenBurns(index))
}

onMounted(() => {
  nextTick(() => applyKenBurns(0))
})
</script>
