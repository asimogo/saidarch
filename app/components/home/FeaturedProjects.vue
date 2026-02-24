<template>
  <section v-if="projects?.length" id="projects" class="py-section">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="font-heading text-h2 mb-4">{{ $t('projects.title') }}</h2>
        <div class="khmer-divider max-w-xs mx-auto" />
      </div>

      <!-- Projects carousel -->
      <div v-if="projects?.length" class="relative">
        <BaseCarousel
          ref="carouselRef"
          :total="projects.length"
          :autoplay="false"
          :show-dots="true"
          class="aspect-[16/10] md:aspect-[16/8]"
          @change="onProjectChange"
        >
          <template #default="{ currentIndex }">
            <div
              v-for="(project, i) in projects"
              :key="project.id"
              class="absolute inset-0 transition-opacity duration-700"
              :class="i === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <NuxtLink :to="localePath(`/project/${project.slug}`)">
                <div class="relative w-full h-full group cursor-pointer">
                  <NuxtImg
                    v-if="project.cover_url"
                    :src="project.cover_url"
                    :alt="l(project, 'title')"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    format="webp"
                    :quality="80"
                    sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div class="absolute bottom-8 left-8 right-8 text-white">
                    <h3 class="font-heading text-2xl md:text-4xl tracking-wider mb-2">
                      {{ l(project, 'title') }}
                    </h3>
                    <p class="text-sm text-white/70 tracking-wider uppercase">
                      {{ project.location }} · {{ project.year }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </BaseCarousel>

        <!-- Navigation arrows (PC only) -->
        <template v-if="projects.length > 1">
          <button
            class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label="Previous project"
            @click="carouselRef?.prev()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label="Next project"
            @click="carouselRef?.next()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>
      </div>

      <!-- View All button -->
      <div class="text-center mt-10">
        <BaseButton variant="outline" :to="localePath('/projects')">
          {{ $t('projects.viewAll') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

defineProps<{
  projects: ProjectWithRelations[] | null
}>()

const { l } = useLocalizedField()
const localePath = useLocalePath()
const carouselRef = ref<{ next: () => void; prev: () => void } | null>(null)

const onProjectChange = (_index: number) => {
  // Could track analytics here
}
</script>
