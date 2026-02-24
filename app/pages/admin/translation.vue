<template>
  <div>
    <AdminHeader breadcrumb="Translation Prompts" />
    <div class="p-6 max-w-3xl">
      <h1 class="text-lg font-semibold mb-2">AI Translation Prompts</h1>
      <p class="text-sm text-gray-500 mb-6">Customize the system prompts used for DeepSeek AI translation per content type.</p>

      <div class="space-y-6">
        <div
          v-for="prompt in prompts"
          :key="prompt.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5"
        >
          <div class="flex justify-between items-center mb-3">
            <label class="text-sm font-medium capitalize">{{ prompt.section_type }}</label>
            <button
              class="text-xs text-bronze hover:text-bronze-hover"
              @click="savePrompt(prompt)"
            >
              Save
            </button>
          </div>
          <textarea
            v-model="prompt.prompt_text"
            rows="4"
            class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-transparent resize-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslationPrompt } from '~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const supabase = useSupabase()

const { data: promptsData } = await useAsyncData('admin-prompts', () =>
  supabase.from('translation_prompts').select('*').then(({ data }) => data),
)

const prompts = ref<TranslationPrompt[]>([])
watch(promptsData, (val) => { if (val) prompts.value = [...val] }, { immediate: true })

const savePrompt = async (prompt: TranslationPrompt) => {
  await supabase
    .from('translation_prompts')
    .update({ prompt_text: prompt.prompt_text })
    .eq('id', prompt.id)
}
</script>
