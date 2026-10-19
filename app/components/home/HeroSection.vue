<template>
  <section id="hero" ref="heroRef" class="relative h-[100svh] md:h-screen -mt-16 overflow-hidden">
    <BaseCarousel
      ref="carouselRef"
      :total="slides?.length || 0"
      :autoplay="true"
      :interval="6000"
      :initial-index="startIndex"
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
            :preload="i === startIndex"
            :loading="i === startIndex ? 'eager' : 'lazy'"
            :quality="85"
            sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      </template>
    </BaseCarousel>

    <!-- Navigation arrows -->
    <template v-if="slides && slides.length > 1">
      <button
        class="flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Previous slide"
        @click="carouselRef?.prev()"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Next slide"
        @click="carouselRef?.next()"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </template>

    <!-- Content overlay — bottom-left aligned, max-w-7xl to match other sections.
         pointer-events-none so clicks and swipes reach the carousel underneath. -->
    <div class="absolute inset-0 z-10 flex items-end pb-20 md:pb-24 pointer-events-none">
      <div class="max-w-7xl mx-auto w-full px-6 text-left text-white">
        <h1 v-if="currentSlide" class="font-heading text-2xl md:text-3xl lg:text-4xl tracking-wider mb-3">
          {{ l(currentSlide, 'title') }}
        </h1>

        <!-- Project metadata: inline on mobile, columns on md+ -->
        <div v-if="linkedProject" class="mb-4">
          <!-- Mobile: single line with separators -->
          <p class="md:hidden text-sm text-white/80">
            {{ metadataLine }}
          </p>
          <!-- Desktop: label + value columns -->
          <div class="hidden md:flex gap-x-8">
            <div v-if="linkedProject.category">
              <p class="text-xs uppercase tracking-wider text-bronze mb-0.5">{{ $t('project.category') }}</p>
              <p class="text-sm text-white/90">{{ l(linkedProject.category, 'name') }}</p>
            </div>
            <div v-if="linkedProject.location">
              <p class="text-xs uppercase tracking-wider text-bronze mb-0.5">{{ $t('project.location') }}</p>
              <p class="text-sm text-white/90">{{ linkedProject.location }}</p>
            </div>
            <div v-if="linkedProject.area">
              <p class="text-xs uppercase tracking-wider text-bronze mb-0.5">{{ $t('project.area') }}</p>
              <p class="text-sm text-white/90">{{ linkedProject.area }}</p>
            </div>
            <div v-if="linkedProject.year">
              <p class="text-xs uppercase tracking-wider text-bronze mb-0.5">{{ $t('project.year') }}</p>
              <p class="text-sm text-white/90">{{ linkedProject.year }}</p>
            </div>
          </div>
        </div>

        <NuxtLink
          :to="currentSlide?.cta_link || localePath('/projects')"
          class="inline-flex items-center gap-2 text-sm tracking-wide text-white/80 hover:text-bronze transition-colors pointer-events-auto"
        >
          {{ l(currentSlide, 'cta_text') || $t('hero.viewProjects') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll down indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce pointer-events-none">
      <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroSlideWithProject } from '~/shared/types'

const props = defineProps<{
  slides: HeroSlideWithProject[] | null
}>()

const { l } = useLocalizedField()
const localePath = useLocalePath()
const { kenBurns } = useAnimation()

const heroRef = ref<HTMLElement | null>(null)
const carouselRef = ref<{ next: () => void; prev: () => void } | null>(null)
// Start on a random slide each visit. The hero only renders client-side (the home
// page shows LoadingScreen until mounted), so this can't cause a hydration mismatch.
const startIndex = Math.floor(Math.random() * (props.slides?.length || 1))
const currentIndex = ref(startIndex)
const currentSlide = computed(() => props.slides?.[currentIndex.value] || null)
const linkedProject = computed(() => currentSlide.value?.project || null)
const metadataLine = computed(() => {
  const p = linkedProject.value
  if (!p) return ''
  return [
    p.category ? l(p.category, 'name') : null,
    p.location,
    p.year,
  ].filter(Boolean).join(' · ')
})

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
  nextTick(() => applyKenBurns(startIndex))
})
</script>
