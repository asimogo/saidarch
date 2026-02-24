<template>
  <article v-if="project">
    <!-- Fullscreen cover -->
    <section class="relative h-screen -mt-16">
      <NuxtImg
        v-if="project.cover_url"
        :src="project.cover_url"
        :alt="l(project, 'title')"
        class="w-full h-full object-cover"
        format="webp"
        :quality="85"
        sizes="100vw"
        preload
      />
      <div class="absolute inset-0 bg-black/40 flex items-end p-8 lg:p-16">
        <div>
          <StatusBadge v-if="project.project_status && project.project_status !== 'completed'" :status="project.project_status" class="mb-3" />
          <h1 class="font-heading text-4xl md:text-6xl lg:text-h1 text-white mt-4">
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

    <!-- Related projects -->
    <RelatedProjects :current="project" :projects="allProjects" />

    <!-- Project navigation -->
    <ProjectNav :current="project" :all-projects="allProjects" />
  </article>
</template>

<script setup lang="ts">
import type { ProjectWithRelations } from '~/shared/types'

const route = useRoute()
const slug = route.params.slug as string
const supabase = useSupabase()
const { l } = useLocalizedField()

// Check for slug redirect
const { data: redirect } = await useAsyncData(`redirect-${slug}`, () =>
  supabase
    .from('slug_redirects')
    .select('new_slug')
    .eq('old_slug', slug)
    .single()
    .then(({ data }) => data),
)
if (redirect.value) {
  navigateTo(`/project/${redirect.value.new_slug}`, { redirectCode: 301 })
}

// Fetch project with images
const { data: project } = await useAsyncData(`project-${slug}`, () =>
  supabase
    .from('projects')
    .select('*, category:categories(*), project_images(*)')
    .eq('slug', slug)
    .eq('publish_status', 'published')
    .single()
    .then(({ data }) => data as ProjectWithRelations | null),
)

if (!project.value) {
  throw createError({ statusCode: 404, message: 'Project not found' })
}

// Fetch all projects for navigation and related
const { data: allProjects } = await useAsyncData('nav-projects', () =>
  supabase
    .from('projects')
    .select('*, category:categories(*), project_images(*)')
    .eq('publish_status', 'published')
    .order('sort_order')
    .then(({ data }) => data as ProjectWithRelations[] | null),
)

// SEO
const config = useRuntimeConfig()
const projectTitle = l(project.value, 'title')
const projectDesc = l(project.value, 'seo_description') || l(project.value, 'description')
const projectImage = project.value.og_image_url || project.value.cover_url

useSeoMeta({
  title: l(project.value, 'seo_title') || projectTitle,
  ogTitle: projectTitle,
  description: projectDesc,
  ogDescription: projectDesc,
  ogImage: projectImage,
  ogType: 'article',
})

// JSON-LD structured data for this project
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: projectTitle,
        description: projectDesc,
        image: projectImage,
        url: `${config.public.siteUrl || ''}/project/${project.value.slug}`,
        dateCreated: project.value.year ? `${project.value.year}` : undefined,
        locationCreated: project.value.location
          ? { '@type': 'Place', name: project.value.location }
          : undefined,
        creator: {
          '@type': 'Organization',
          name: 'SAID | Summit Architecture & Interior Design',
          url: config.public.siteUrl || 'https://saidarch.com',
        },
      }),
    },
  ],
})
</script>
