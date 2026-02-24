<template>
  <div>
    <AdminHeader breadcrumb="Categories" />
    <div class="p-6 max-w-2xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-lg font-semibold">Categories</h1>
        <button class="px-4 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors" @click="addCategory">
          + Add Category
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="cat in localCategories"
          :key="cat.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-4"
        >
          <div class="flex-1 grid grid-cols-3 gap-3">
            <input v-model="cat.name_zh" placeholder="中文名称" class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            <input v-model="cat.name_en" placeholder="English Name" class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent" />
            <input v-model="cat.slug" placeholder="slug" class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent font-mono" />
          </div>
          <button class="text-xs text-red-500 hover:text-red-700 shrink-0" @click="removeCategory(cat.id)">Delete</button>
        </div>
      </div>

      <button
        v-if="localCategories.length"
        class="mt-6 px-6 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors"
        :disabled="saving"
        @click="saveAll"
      >
        {{ saving ? 'Saving...' : 'Save All' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()
const saving = ref(false)

const { data: categories, refresh } = await useAsyncData('admin-cats', () =>
  supabase.from('categories').select('*').order('sort_order').then(({ data }) => data),
)

const localCategories = ref<Category[]>([])
watch(categories, (val) => { if (val) localCategories.value = [...val] }, { immediate: true })

const addCategory = () => {
  localCategories.value.push({
    id: crypto.randomUUID(),
    name_zh: '',
    name_en: '',
    name_km: null,
    slug: '',
    sort_order: localCategories.value.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}

const removeCategory = async (id: string) => {
  if (!confirm('Delete this category?')) return
  await supabase.from('categories').delete().eq('id', id)
  localCategories.value = localCategories.value.filter(c => c.id !== id)
}

const saveAll = async () => {
  saving.value = true
  try {
    for (let i = 0; i < localCategories.value.length; i++) {
      const cat = localCategories.value[i]
      await supabase.from('categories').upsert({
        id: cat.id,
        name_zh: cat.name_zh,
        name_en: cat.name_en,
        slug: cat.slug,
        sort_order: i,
      })
    }
    await refresh()
  } finally {
    saving.value = false
  }
}
</script>
