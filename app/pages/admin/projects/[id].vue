<template>
  <div>
    <AdminHeader :breadcrumb="isNew ? 'New Project' : 'Edit Project'" />
    <div class="p-6 max-w-4xl">
      <!-- Top actions -->
      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/admin/projects" class="text-sm text-gray-500 hover:text-bronze">&larr; Back to list</NuxtLink>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 hover:border-bronze transition-colors rounded"
            :disabled="saving"
            @click="saveDraft"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 hover:border-bronze transition-colors rounded disabled:opacity-50"
            :disabled="saving || (!form.title_zh && !form.title_en)"
            @click="previewProject"
          >
            {{ saving ? 'Saving...' : (isNew ? 'Save & Preview' : 'Preview') }}
          </button>
          <AdminPublishWorkflow
            v-if="!isNew"
            :status="form.publish_status as any"
            :project-id="id"
            :project-slug="form.slug"
            @updated="onPublishStatusChanged"
          />
        </div>
      </div>

      <form class="space-y-8" @submit.prevent="saveDraft">
        <!-- Basic info -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
          <h2 class="font-semibold mb-4">Basic Info</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">标题（中文）*</label>
              <input v-model="form.title_zh" required class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Title (English)</label>
              <input v-model="form.title_en" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
          </div>

          <div>
            <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">URL Slug</label>
            <input v-model="form.slug" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent font-mono" />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
              <select v-model="form.category_id" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent">
                <option :value="null">-</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name_en }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Location</label>
              <input v-model="form.location" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Area</label>
              <input v-model="form.area" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
            <div>
              <label class="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Year</label>
              <input v-model.number="form.year" type="number" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
          </div>

          <label class="flex items-center gap-2">
            <input v-model="form.is_featured" type="checkbox" class="accent-bronze" />
            <span class="text-sm">Featured on homepage</span>
          </label>
        </section>

        <!-- Cover image -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Cover Image</h2>
          <div class="max-w-md">
            <AdminImageUploader v-model="form.cover_url" :folder="`projects/${form.slug || 'new'}`" />
          </div>
        </section>

        <!-- Project Images -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Gallery Images</h2>

          <!-- Batch upload -->
          <AdminBatchImageUploader
            :folder="`projects/${form.slug || 'new'}`"
            @uploaded="onBatchImageUploaded"
          />

          <!-- Existing images grid (draggable) -->
          <div v-if="galleryImages.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div
              v-for="(img, idx) in galleryImages"
              :key="idx"
              class="space-y-2 rounded-lg border p-2 transition-all duration-200"
              :class="galleryDragIndex === idx
                ? 'border-bronze bg-bronze/5 opacity-50'
                : galleryDragOverIndex === idx
                  ? 'border-bronze border-dashed bg-bronze/5'
                  : 'border-transparent'"
              draggable="true"
              @dragstart="handleGalleryDragStart(idx)"
              @dragover.prevent="handleGalleryDragOver(idx)"
              @dragleave="handleGalleryDragLeave"
              @drop.prevent="handleGalleryDrop(idx)"
              @dragend="handleGalleryDragEnd"
            >
              <div class="relative">
                <AdminImageUploader v-model="img.image_url" :folder="`projects/${form.slug || 'new'}`" />
                <button
                  type="button"
                  class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors text-xs leading-none"
                  @click="galleryImages.splice(idx, 1)"
                >
                  &times;
                </button>
                <div class="absolute top-1 left-1 cursor-grab active:cursor-grabbing text-white/70 hover:text-white bg-black/30 rounded-full w-5 h-5 flex items-center justify-center">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                  </svg>
                </div>
              </div>
              <input v-model="img.caption_zh" placeholder="说明（中文）" class="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
              <input v-model="img.caption_en" placeholder="Caption (EN)" class="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 mt-4">No gallery images yet.</p>
        </section>

        <!-- Description -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold">Design Concept</h2>
            <button
              type="button"
              class="text-xs text-bronze hover:text-bronze-hover"
              @click="translateAll"
            >
              AI Translate All →
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-400 mb-1 block">中文</label>
              <textarea v-model="form.description_zh" rows="6" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent resize-none" />
            </div>
            <div>
              <label class="text-xs text-gray-400 mb-1 block">English</label>
              <textarea v-model="form.description_en" rows="6" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent resize-none" />
            </div>
          </div>
        </section>

        <!-- SEO -->
        <details class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <summary class="px-6 py-4 cursor-pointer font-semibold">SEO Settings</summary>
          <div class="px-6 pb-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">SEO 标题（中文）</label>
                <input v-model="form.seo_title_zh" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">SEO Title (English)</label>
                <input v-model="form.seo_title_en" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">SEO 描述（中文）</label>
                <textarea v-model="form.seo_description_zh" rows="2" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent resize-none" />
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">SEO Description (English)</label>
                <textarea v-model="form.seo_description_en" rows="2" class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent resize-none" />
              </div>
            </div>
          </div>
        </details>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '~/utils/helpers'
import type { PublishStatus } from '~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const supabase = useSupabase()
const id = route.params.id as string
const isNew = id === 'new'
const saving = ref(false)

const form = reactive({
  title_zh: '',
  title_en: '',
  slug: '',
  cover_url: '',
  category_id: null as string | null,
  location: '',
  area: '',
  year: null as number | null,
  description_zh: '',
  description_en: '',
  seo_title_zh: '',
  seo_title_en: '',
  seo_description_zh: '',
  seo_description_en: '',
  og_image_url: '',
  is_featured: false,
  publish_status: 'draft' as string,
  preview_token: '',
})

// Gallery images
const galleryImages = ref<Array<{ image_url: string; caption_zh: string; caption_en: string; sort_order: number }>>([])

// Track original slug for redirect
const originalSlug = ref('')

// Fetch categories
const { data: categories } = await useAsyncData('admin-categories', () =>
  supabase.from('categories').select('*').order('sort_order').then(({ data }) => data),
)

// Load existing project
if (!isNew) {
  const { data } = await useAsyncData(`admin-project-${id}`, () =>
    supabase.from('projects').select('*, project_images(*)').eq('id', id).single().then(({ data }) => data),
  )
  if (data.value) {
    const { project_images, ...projectData } = data.value as any
    Object.assign(form, projectData)
    originalSlug.value = projectData.slug || ''
    if (project_images?.length) {
      galleryImages.value = project_images
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => ({
          image_url: img.image_url || '',
          caption_zh: img.caption_zh || '',
          caption_en: img.caption_en || '',
          sort_order: img.sort_order || 0,
        }))
    }
  }
}

// Auto-generate slug from title
watch(() => form.title_zh, (val) => {
  if (isNew && val && !form.slug) {
    form.slug = slugify(val)
  }
})

// Gallery drag-and-drop reorder
const galleryDragIndex = ref<number | null>(null)
const galleryDragOverIndex = ref<number | null>(null)

function handleGalleryDragStart(index: number) {
  galleryDragIndex.value = index
}
function handleGalleryDragOver(index: number) {
  if (galleryDragIndex.value === null || galleryDragIndex.value === index) return
  galleryDragOverIndex.value = index
}
function handleGalleryDragLeave() {
  galleryDragOverIndex.value = null
}
function handleGalleryDrop(targetIndex: number) {
  if (galleryDragIndex.value === null || galleryDragIndex.value === targetIndex) return
  const items = [...galleryImages.value]
  const [moved] = items.splice(galleryDragIndex.value, 1)
  items.splice(targetIndex, 0, moved)
  galleryImages.value = items.map((img, i) => ({ ...img, sort_order: i }))
  galleryDragIndex.value = null
  galleryDragOverIndex.value = null
  // Auto-save order for existing projects
  if (!isNew) saveGalleryImages(id)
}
function handleGalleryDragEnd() {
  galleryDragIndex.value = null
  galleryDragOverIndex.value = null
}

const onBatchImageUploaded = (url: string) => {
  galleryImages.value.push({
    image_url: url,
    caption_zh: '',
    caption_en: '',
    sort_order: galleryImages.value.length,
  })
}

// Save slug redirect if slug changed
const saveSlugRedirect = async () => {
  if (!originalSlug.value || originalSlug.value === form.slug) return
  await supabase.from('slug_redirects').insert({
    old_slug: originalSlug.value,
    new_slug: form.slug,
  })
  originalSlug.value = form.slug
}

// Save gallery images
const saveGalleryImages = async (projectId: string) => {
  // Delete existing images
  await supabase.from('project_images').delete().eq('project_id', projectId)
  // Insert new ones
  const images = galleryImages.value
    .filter(img => img.image_url)
    .map((img, i) => ({
      project_id: projectId,
      image_url: img.image_url,
      caption_zh: img.caption_zh || null,
      caption_en: img.caption_en || null,
      sort_order: i,
    }))
  if (images.length) {
    await supabase.from('project_images').insert(images)
  }
}

function generatePreviewToken(): string {
  const array = new Uint8Array(24)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const saveProject = async (): Promise<{ id: string; slug: string } | null> => {
  if (!form.slug?.trim()) {
    form.slug = slugify(form.title_en || form.title_zh || `project-${Date.now()}`)
  }

  const { preview_token, ...payload } = { ...form }
  if (isNew) {
    const { data } = await supabase.from('projects').insert(payload).select('id').single()
    if (data) {
      await saveGalleryImages(data.id)
      return { id: data.id, slug: form.slug }
    }
    return null
  } else {
    await saveSlugRedirect()
    await supabase.from('projects').update(payload).eq('id', id)
    await saveGalleryImages(id)
    return { id, slug: form.slug }
  }
}

const saveDraft = async () => {
  saving.value = true
  try {
    const result = await saveProject()
    if (result && isNew) {
      navigateTo(`/admin/projects/${result.id}`)
    }
  } finally {
    saving.value = false
  }
}

const previewProject = async () => {
  saving.value = true
  try {
    const result = await saveProject()
    if (!result) return

    const token = generatePreviewToken()
    const { error } = await supabase
      .from('projects')
      .update({ preview_token: token })
      .eq('id', result.id)
    if (error) throw error

    window.open(`/preview/${result.slug}?token=${token}`, '_blank')

    if (isNew) {
      navigateTo(`/admin/projects/${result.id}`)
    }
  } catch (err) {
    console.error('Preview failed:', err)
  } finally {
    saving.value = false
  }
}

const onPublishStatusChanged = (status: PublishStatus) => {
  form.publish_status = status
}

const translateAll = async () => {
  const texts = []
  if (form.title_zh) texts.push({ field: 'title', content: form.title_zh })
  if (form.description_zh) texts.push({ field: 'description', content: form.description_zh })

  if (!texts.length) return

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('Session expired')
    }

    const { translations } = await $fetch<{ translations: Record<string, string> }>('/api/translate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { texts, sectionType: 'project' },
    })
    if (translations.title) form.title_en = translations.title
    if (translations.description) form.description_en = translations.description
  } catch (e) {
    console.error('Translation failed:', e)
  }
}
</script>
