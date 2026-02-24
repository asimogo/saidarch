<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-heading mb-2">Preview Unavailable</h1>
      <p class="text-subtle-light dark:text-subtle-dark">{{ error }}</p>
    </div>
  </div>

  <article v-else-if="project">
    <!-- Preview banner -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-2 text-sm font-medium">
      PREVIEW MODE — This page is not published
    </div>

    <!-- Fullscreen cover -->
    <section class="relative h-screen -mt-16 pt-10">
      <NuxtImg
        v-if="project.cover_url"
        :src="project.cover_url"
        :alt="l(project, 'title')"
        class="w-full h-full object-cover"
        format="webp"
        :quality="85"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      />
      <div class="absolute inset-0 bg-black/40 flex items-end p-8 lg:p-16">
        <div>
          <h1 class="font-heading text-4xl md:text-6xl lg:text-h1 text-white">
            {{ l(project, 'title') }}
          </h1>
        </div>
      </div>
    </section>

    <!-- Project info -->
    <ProjectInfo :project="project" />

    <!-- Description -->
    <section v-if="l(project, 'description')" class="max-w-3xl mx-auto px-6 py-section">
      <h2 class="font-heading text-h2 mb-6">{{ $t('project.description') }}</h2>
      <hr class="max-w-[120px] mb-8" />
      <p class="text-body leading-relaxed text-subtle-light dark:text-subtle-dark whitespace-pre-line">
        {{ l(project, 'description') }}
      </p>
    </section>

    <!-- Gallery -->
    <ProjectGallery v-if="project.project_images?.length" :images="project.project_images" />

    <!-- Social share -->
    <SocialShare :slug="project.slug" :title="l(project, 'title')" />
  </article>

  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-subtle-light dark:text-subtle-dark">Loading preview...</p>
  </div>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string
const token = (route.query.token as string) || ''
const { l } = useLocalizedField()

const project = ref<ProjectWithRelations | null>(null)
const error = ref<string | null>(null)

try {
  if (!token) {
    error.value = 'Missing preview token'
  } else {
    const data = await $fetch<ProjectWithRelations>(`/api/preview/${slug}`, {
      query: { token },
    })
    project.value = data
  }
} catch (e: any) {
  error.value = e?.data?.message || 'Invalid or expired preview link'
}

useHead({ title: project.value ? `Preview: ${l(project.value, 'title')}` : 'Preview' })
</script>
