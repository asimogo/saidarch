<template>
  <div>
    <AdminHeader breadcrumb="Hero Slides" />
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-lg font-semibold">Hero Slides</h1>
        <button class="px-4 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors" @click="addSlide">
          + Add Slide
        </button>
      </div>

      <AdminSortableList :items="slides" @reorder="slides = $event">
        <template #default="{ item: slide }">
          <div class="flex gap-4 w-full">
            <!-- Image uploader -->
            <div class="w-40 shrink-0">
              <AdminImageUploader v-model="slide.image_url" folder="hero" />
            </div>
            <!-- Fields -->
            <div class="flex-1 min-w-0 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="slide.title_zh"
                  placeholder="标题（中文）"
                  class="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1"
                />
                <input
                  v-model="slide.title_en"
                  placeholder="Title (English)"
                  class="w-full text-sm text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1"
                />
              </div>
              <!-- Project selector -->
              <div class="grid grid-cols-3 gap-2">
                <select
                  :value="slide.project_id || ''"
                  class="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1 col-span-2"
                  @change="onProjectSelect(slide, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="">-- 关联项目 (Link Project) --</option>
                  <option v-for="p in projects" :key="p.id" :value="p.id">
                    {{ p.title_zh || p.title_en }} — {{ p.location || '' }}
                  </option>
                </select>
                <input
                  v-model="slide.cta_link"
                  placeholder="CTA Link (e.g. /projects/xxx)"
                  class="w-full text-xs text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1"
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="slide.cta_text_zh"
                  placeholder="CTA 文案（中文）"
                  class="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1"
                />
                <input
                  v-model="slide.cta_text_en"
                  placeholder="CTA Text (English)"
                  class="w-full text-xs text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-bronze focus:outline-none pb-1"
                />
              </div>
            </div>
            <!-- Actions -->
            <div class="flex flex-col gap-2 shrink-0">
              <button
                class="px-3 py-1 text-xs border rounded transition-colors"
                :class="slide.is_active ? 'border-emerald-400 text-emerald-600' : 'border-gray-300 text-gray-400'"
                @click="slide.is_active = !slide.is_active"
              >
                {{ slide.is_active ? 'Active' : 'Inactive' }}
              </button>
              <button class="px-3 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" @click="removeSlide(slide.id)">
                Delete
              </button>
            </div>
          </div>
        </template>
      </AdminSortableList>

      <button
        v-if="slides?.length"
        class="mt-6 px-6 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors"
        :disabled="saving"
        @click="saveAll"
      >
        {{ saving ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeroSlide, Project } from '~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()
const saving = ref(false)

const { data: slidesData, refresh } = await useAsyncData('admin-hero', () =>
  supabase.from('hero_slides').select('*').order('sort_order').then(({ data }) => data),
)

const { data: projectsData } = await useAsyncData('admin-projects-list', () =>
  supabase.from('projects').select('id, title_zh, title_en, slug, location').eq('publish_status', 'published').order('sort_order').then(({ data }) => data),
)

const slides = ref<HeroSlide[]>([])
const projects = computed(() => projectsData.value || [])
watch(slidesData, (val) => { if (val) slides.value = [...val] }, { immediate: true })

const onProjectSelect = (slide: HeroSlide, projectId: string) => {
  if (!projectId) {
    slide.project_id = null
    return
  }
  slide.project_id = projectId
  const project = projects.value.find((p: Pick<Project, 'id' | 'slug'>) => p.id === projectId)
  if (project) {
    slide.cta_link = `/project/${project.slug}`
  }
}

const addSlide = () => {
  slides.value.push({
    id: crypto.randomUUID(),
    image_url: '',
    title_zh: '',
    title_en: '',
    subtitle_zh: '',
    subtitle_en: '',
    cta_text_zh: '查看作品',
    cta_text_en: 'View Projects',
    cta_link: '/projects',
    project_id: null,
    sort_order: slides.value.length,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as HeroSlide)
}

const removeSlide = async (id: string) => {
  if (!confirm('Delete this slide?')) return
  await supabase.from('hero_slides').delete().eq('id', id)
  slides.value = slides.value.filter(s => s.id !== id)
}

const saveAll = async () => {
  saving.value = true
  try {
    for (let i = 0; i < slides.value.length; i++) {
      const slide = slides.value[i]
      const data = {
        image_url: slide.image_url,
        title_zh: slide.title_zh,
        title_en: slide.title_en,
        subtitle_zh: slide.subtitle_zh,
        subtitle_en: slide.subtitle_en,
        cta_text_zh: slide.cta_text_zh,
        cta_text_en: slide.cta_text_en,
        cta_link: slide.cta_link,
        project_id: slide.project_id,
        sort_order: i,
        is_active: slide.is_active,
      }
      await supabase.from('hero_slides').upsert({ id: slide.id, ...data })
    }
    await refresh()
  } finally {
    saving.value = false
  }
}
</script>
