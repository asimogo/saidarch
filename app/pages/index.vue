<template>
  <div>
    <LoadingScreen v-if="isLoading" />
    <template v-else>
      <HeroSection :slides="heroSlides || []" />
      <FeaturedProjects :projects="featuredProjects || []" />
      <AboutSection v-if="siteSettings" :settings="siteSettings" />
      <ContactSection v-if="siteSettings" :settings="siteSettings" />
      <BrandClosing v-if="siteSettings" :settings="siteSettings" />
    </template>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()
const isLoading = ref(true)

// Site settings (may fail if Supabase not configured)
let siteSettings: Awaited<ReturnType<typeof useSiteSettings>> | null = null
try {
  siteSettings = await useSiteSettings()
} catch {
  // Supabase not configured yet
}

// Hero slides
const { data: heroSlides } = await useAsyncData('hero-slides', async () => {
  try {
    const { data } = await supabase
      .from('hero_slides')
      .select('*, project:projects(*, category:categories(*))')
      .eq('is_active', true)
      .order('sort_order')
    return data
  } catch { return null }
})

// Featured projects
const { data: featuredProjects } = await useAsyncData('featured-projects', async () => {
  try {
    const { data } = await supabase
      .from('projects')
      .select('*, category:categories(*)')
      .eq('publish_status', 'published')
      .eq('is_featured', true)
      .order('sort_order')
    return data
  } catch { return null }
})

// SEO
const seoTitle = siteSettings?.get('seo_title') || 'SAID | Summit Architecture & Interior Design'
const seoDesc = siteSettings?.get('seo_description') || 'Elite Architecture Design Team in Cambodia'

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDesc,
  ogDescription: seoDesc,
  ogImage: siteSettings?.get('og_image_url'),
})

onMounted(() => {
  isLoading.value = false
})
</script>
