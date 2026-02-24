<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-light bg-white text-sm font-medium text-deep-rock hover:border-bronze hover:text-bronze transition-colors disabled:opacity-50 dark:border-border-dark dark:bg-deep-rock dark:text-sandstone dark:hover:border-bronze dark:hover:text-bronze"
    :disabled="generating"
    @click="handlePreview"
  >
    <!-- Eye Icon -->
    <svg
      v-if="!generating"
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
    <span>预览</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  slug: string
  projectId: string
}

const props = defineProps<Props>()

const supabase = useSupabase()
const generating = ref(false)

function generateToken(): string {
  const array = new Uint8Array(24)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function handlePreview() {
  generating.value = true

  try {
    const token = generateToken()

    // Save preview token to database
    const { error } = await supabase
      .from('projects')
      .update({ preview_token: token })
      .eq('id', props.projectId)

    if (error) throw error

    // Open preview in new window
    const previewUrl = `/preview/${props.slug}?token=${token}`
    window.open(previewUrl, '_blank')
  } catch (err: any) {
    console.error('Failed to generate preview token:', err)
  } finally {
    generating.value = false
  }
}
</script>
