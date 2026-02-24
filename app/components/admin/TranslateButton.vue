<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-bronze text-white text-sm font-medium hover:bg-bronze-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="translating || !texts.length"
    @click="handleTranslate"
  >
    <!-- Translate Icon -->
    <svg
      v-if="!translating"
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
    <!-- Spinner -->
    <svg
      v-else
      class="w-4 h-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <span>{{ translating ? 'AI 翻译中...' : 'AI 翻译全部' }}</span>
  </button>
</template>

<script setup lang="ts">
interface TextItem {
  field: string
  content: string
}

interface Props {
  texts: TextItem[]
  sectionType: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  translated: [results: Record<string, string>]
}>()

const supabase = useSupabase()
const translating = ref(false)

async function handleTranslate() {
  if (!props.texts.length || translating.value) return

  translating.value = true

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('Session expired')
    }

    const response = await $fetch<{ translations: Record<string, string> }>('/api/translate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: {
        texts: props.texts,
        sectionType: props.sectionType,
      },
    })

    emit('translated', response.translations)
  } catch (err: any) {
    console.error('Translation failed:', err)
  } finally {
    translating.value = false
  }
}
</script>
