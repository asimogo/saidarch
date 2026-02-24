<template>
  <div>
    <AdminHeader breadcrumb="Settings" />
    <div class="p-6">
      <!-- Tabs -->
      <div class="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px"
          :class="activeTab === tab ? 'border-bronze text-bronze' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Settings form -->
      <div v-if="groupedSettings[activeTab]" class="space-y-6 max-w-2xl">
        <div
          v-for="setting in groupedSettings[activeTab]"
          :key="setting.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
        >
          <label class="block text-xs text-gray-500 uppercase tracking-wider mb-3">
            {{ setting.description || setting.key }}
          </label>

          <template v-if="setting.type === 'image'">
            <div class="max-w-sm">
              <AdminImageUploader
                :model-value="formData[setting.key + '_zh'] || ''"
                :folder="getImageFolder(setting.key)"
                @update:model-value="formData[setting.key + '_zh'] = $event"
              />
            </div>
          </template>

          <template v-else-if="isNumberField(setting.key)">
            <input
              v-model="formData[setting.key + '_zh']"
              type="number"
              class="w-32 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent"
            />
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-400">中文</span>
                  <button
                    v-if="isLargeTextField(setting.key)"
                    class="text-xs text-bronze hover:text-bronze-hover transition-colors"
                    @click="togglePreview(setting.key + '_zh')"
                  >
                    {{ previewKey === setting.key + '_zh' ? '编辑' : '预览' }}
                  </button>
                </div>
                <div
                  v-if="previewKey === setting.key + '_zh'"
                  class="prose-intro w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 min-h-30"
                  v-html="renderMarkdown(formData[setting.key + '_zh'] || '')"
                />
                <textarea
                  v-else
                  v-model="formData[setting.key + '_zh']"
                  :rows="isLargeTextField(setting.key) ? 5 : 2"
                  class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent"
                  :class="isLargeTextField(setting.key) ? 'resize-y' : 'resize-none'"
                />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-400">English</span>
                  <div v-if="isLargeTextField(setting.key)" class="flex items-center gap-3">
                    <button
                      class="text-xs text-bronze hover:text-bronze-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="translating || !formData[setting.key + '_zh']"
                      @click="translateField(setting.key)"
                    >
                      {{ translating ? 'AI 翻译中...' : 'AI 翻译 →' }}
                    </button>
                    <button
                      class="text-xs text-bronze hover:text-bronze-hover transition-colors"
                      @click="togglePreview(setting.key + '_en')"
                    >
                      {{ previewKey === setting.key + '_en' ? 'Edit' : 'Preview' }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="previewKey === setting.key + '_en'"
                  class="prose-intro w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 min-h-30"
                  v-html="renderMarkdown(formData[setting.key + '_en'] || '')"
                />
                <textarea
                  v-else
                  v-model="formData[setting.key + '_en']"
                  :rows="isLargeTextField(setting.key) ? 5 : 2"
                  class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent"
                  :class="isLargeTextField(setting.key) ? 'resize-y' : 'resize-none'"
                />
              </div>
            </div>
            <p v-if="isLargeTextField(setting.key)" class="text-xs text-gray-400 mt-2">
              Markdown: **粗体** / *斜体* / [链接](url) / - 列表项
            </p>
          </template>
        </div>

        <button
          class="px-6 py-2 bg-bronze text-white text-sm hover:bg-bronze-hover transition-colors"
          :disabled="saving"
          @click="saveGroup"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SETTINGS_GROUPS } from '~/utils/constants'
import type { SiteSetting } from '~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()
const tabs = [...SETTINGS_GROUPS]
const activeTab = ref(tabs[0])
const saving = ref(false)
const formData = reactive<Record<string, string>>({})

const { data: allSettings } = await useAsyncData('admin-settings', () =>
  supabase.from('site_settings').select('*').order('sort_order').then(({ data }) => data),
)

// Group settings by group_name
const groupedSettings = computed(() => {
  const grouped: Record<string, SiteSetting[]> = {}
  for (const tab of tabs) grouped[tab] = []
  for (const s of allSettings.value || []) {
    if (grouped[s.group_name]) grouped[s.group_name].push(s)
  }
  return grouped
})

// Initialize form data
watch(allSettings, (settings) => {
  if (!settings) return
  for (const s of settings) {
    formData[s.key + '_zh'] = s.value_zh || ''
    formData[s.key + '_en'] = s.value_en || ''
  }
}, { immediate: true })

const isNumberField = (key: string) => {
  return key.includes('_hour') || key === 'day_start_hour' || key === 'day_end_hour'
}

const LARGE_TEXT_KEYS = new Set(['intro'])
const isLargeTextField = (key: string) => LARGE_TEXT_KEYS.has(key)

const previewKey = ref<string | null>(null)
const togglePreview = (key: string) => {
  previewKey.value = previewKey.value === key ? null : key
}

const translating = ref(false)
const translateField = async (key: string) => {
  const content = formData[key + '_zh']
  if (!content || translating.value) return
  translating.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return
    const { translations } = await $fetch<{ translations: Record<string, string> }>('/api/translate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: {
        texts: [{ field: key, content }],
        sectionType: activeTab.value,
      },
    })
    if (translations[key]) formData[key + '_en'] = translations[key]
  } catch (e) {
    console.error('Translation failed:', e)
  } finally {
    translating.value = false
  }
}

const getImageFolder = (key: string) => {
  if (key.includes('logo')) return 'brand'
  if (key.includes('avatar')) return 'team'
  if (key.includes('og_image')) return 'brand'
  return 'brand'
}

const saveGroup = async () => {
  saving.value = true
  try {
    const settings = groupedSettings.value[activeTab.value] || []
    for (const s of settings) {
      await supabase
        .from('site_settings')
        .update({
          value_zh: formData[s.key + '_zh'] || null,
          value_en: formData[s.key + '_en'] || null,
        })
        .eq('id', s.id)
    }
  } finally {
    saving.value = false
  }
}
</script>
