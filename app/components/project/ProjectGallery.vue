<template>
  <section v-if="images?.length" class="py-section">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="font-heading text-h2 text-center mb-8">{{ $t('project.gallery') }}</h2>
      <hr class="max-w-xs mx-auto mb-12" />

      <div class="grid md:grid-cols-2 gap-4">
        <div
          v-for="(image, i) in images"
          :key="image.id"
          class="cursor-pointer overflow-hidden group"
          @click="openLightbox(i)"
        >
          <NuxtImg
            :src="image.image_url"
            :alt="l(image, 'caption') || `Image ${i + 1}`"
            class="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
            format="webp"
            :quality="80"
            sizes="sm:100vw md:50vw"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Lightbox
      v-if="lightboxOpen"
      :images="images"
      :initial-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </section>
</template>

<script setup lang="ts">
import type { ProjectImage } from '~/shared/types'

defineProps<{
  images: ProjectImage[]
}>()

const { l } = useLocalizedField()
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>
