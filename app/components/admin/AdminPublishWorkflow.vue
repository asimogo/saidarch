<template>
  <div class="flex items-center gap-3">
    <!-- Status Selector -->
    <div class="relative">
      <select
        v-model="selectedStatus"
        :disabled="updating"
        class="appearance-none rounded-md border border-border-light bg-white pl-3 pr-8 py-1.5 text-sm text-deep-rock focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze disabled:opacity-50 dark:border-border-dark dark:bg-deep-rock dark:text-sandstone"
        @change="handleStatusChange"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle-light pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Loading Indicator -->
    <svg
      v-if="updating"
      class="w-4 h-4 text-bronze animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { PublishStatus } from '~/shared/types'

interface Props {
  status: PublishStatus
  projectId: string
  projectSlug: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: [status: PublishStatus]
}>()

const supabase = useSupabase()
const updating = ref(false)

const currentStatus = ref<PublishStatus>(props.status)
const selectedStatus = ref<PublishStatus>(props.status)

watch(
  () => props.status,
  (newStatus) => {
    currentStatus.value = newStatus
    selectedStatus.value = newStatus
  },
)

const statusOptions = [
  { value: 'draft' as PublishStatus, label: '草稿' },
  { value: 'published' as PublishStatus, label: '已发布' },
]

async function handleStatusChange() {
  const newStatus = selectedStatus.value
  if (newStatus === currentStatus.value) return

  updating.value = true

  try {
    const updateData: Record<string, any> = {
      publish_status: newStatus,
    }

    // Set published_at when publishing for the first time
    if (newStatus === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', props.projectId)

    if (error) throw error

    // Trigger route revalidation (best-effort)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token && props.projectSlug) {
      const paths = [
        '/projects',
        '/zh/projects',
        `/project/${props.projectSlug}`,
        `/zh/project/${props.projectSlug}`,
      ]

      await $fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { paths },
      }).catch(() => {})
    }

    currentStatus.value = newStatus
    emit('updated', newStatus)
  } catch (err: any) {
    console.error('Failed to update publish status:', err)
    // Revert selection on error
    selectedStatus.value = currentStatus.value
  } finally {
    updating.value = false
  }
}
</script>
