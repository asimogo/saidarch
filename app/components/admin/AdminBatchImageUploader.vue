<template>
  <div class="space-y-4">
    <!-- Drop zone -->
    <div
      class="relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors"
      :class="isDragging
        ? 'border-bronze bg-bronze/5'
        : 'border-border-light dark:border-border-dark hover:border-bronze/50'"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <svg class="mx-auto w-10 h-10 text-subtle-light dark:text-subtle-dark mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-subtle-light dark:text-subtle-dark">
        拖拽多张图片到此处，或点击批量选择
      </p>
      <p class="text-xs text-subtle-light/60 dark:text-subtle-dark/60 mt-1">
        支持 JPEG, PNG, WebP，每张最大 10MB
      </p>
    </div>

    <!-- Upload queue -->
    <div v-if="queue.length" class="space-y-3">
      <!-- Summary -->
      <div class="flex items-center justify-between text-xs text-subtle-light dark:text-subtle-dark">
        <span>
          已完成 {{ successCount }}/{{ queue.length }}
          <span v-if="errorCount" class="text-red-500">，{{ errorCount }} 张失败</span>
        </span>
        <button
          v-if="hasFinished"
          type="button"
          class="text-xs text-bronze hover:text-bronze-hover"
          @click="clearQueue"
        >
          清除列表
        </button>
      </div>

      <!-- Overall progress bar -->
      <div class="w-full h-1.5 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
        <div
          class="h-full bg-bronze rounded-full transition-all duration-300"
          :style="{ width: `${overallProgress}%` }"
        />
      </div>

      <!-- File thumbnails -->
      <div class="grid grid-cols-3 md:grid-cols-5 gap-3">
        <div
          v-for="item in queue"
          :key="item.id"
          class="relative rounded-md overflow-hidden border border-border-light dark:border-border-dark"
        >
          <img :src="item.preview" :alt="item.name" class="w-full h-20 object-cover" />

          <!-- Overlay for non-success states -->
          <div
            v-if="item.status !== 'success'"
            class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center"
          >
            <template v-if="item.status === 'uploading' || item.status === 'pending'">
              <span class="text-white text-xs">{{ item.progress }}%</span>
              <div class="w-3/4 h-1 bg-white/30 rounded-full mt-1">
                <div class="h-full bg-white rounded-full transition-all duration-200" :style="{ width: `${item.progress}%` }" />
              </div>
            </template>

            <template v-if="item.status === 'error'">
              <span class="text-red-300 text-xs text-center px-2 leading-tight">{{ item.error }}</span>
              <button
                type="button"
                class="mt-1 text-xs text-white underline"
                @click.stop="retryUpload(item)"
              >
                重试
              </button>
            </template>
          </div>

          <!-- Success check -->
          <div v-if="item.status === 'success'" class="absolute top-1 right-1">
            <span class="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  folder: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  uploaded: [url: string]
  'batch-complete': []
}>()

const { validateFile, uploadFile } = useR2Upload()

const MAX_CONCURRENCY = 3

type FileStatus = 'pending' | 'uploading' | 'success' | 'error'

interface QueueItem {
  id: string
  file: File
  name: string
  preview: string
  status: FileStatus
  progress: number
  error: string
  publicUrl: string
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const queue = ref<QueueItem[]>([])
const isProcessing = ref(false)

const successCount = computed(() => queue.value.filter(i => i.status === 'success').length)
const errorCount = computed(() => queue.value.filter(i => i.status === 'error').length)
const hasFinished = computed(() =>
  queue.value.length > 0 && queue.value.every(i => i.status === 'success' || i.status === 'error'),
)
const overallProgress = computed(() => {
  if (!queue.value.length) return 0
  return Math.round(queue.value.reduce((sum, i) => sum + i.progress, 0) / queue.value.length)
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    addFiles(Array.from(target.files))
  }
  target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files?.length) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

function addFiles(files: File[]) {
  for (const file of files) {
    const validationError = validateFile(file)
    queue.value.push({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      status: validationError ? 'error' : 'pending',
      progress: validationError ? 0 : 0,
      error: validationError || '',
      publicUrl: '',
    })
  }
  processQueue()
}

async function processQueue() {
  if (isProcessing.value) return
  isProcessing.value = true

  const getPending = () => queue.value.filter(i => i.status === 'pending')
  const getUploading = () => queue.value.filter(i => i.status === 'uploading')

  while (getPending().length > 0 || getUploading().length > 0) {
    while (getPending().length > 0 && getUploading().length < MAX_CONCURRENCY) {
      const item = getPending()[0]
      item.status = 'uploading'
      uploadSingleFile(item)
    }
    await new Promise(r => setTimeout(r, 100))
  }

  isProcessing.value = false
  emit('batch-complete')
}

async function uploadSingleFile(item: QueueItem) {
  try {
    const result = await uploadFile(item.file, {
      folder: props.folder,
      onProgress: (percent) => { item.progress = percent },
    })
    item.status = 'success'
    item.publicUrl = result.publicUrl
    emit('uploaded', result.publicUrl)
  } catch (err: any) {
    item.status = 'error'
    item.error = err?.message || '上传失败'
  }
}

function retryUpload(item: QueueItem) {
  item.status = 'pending'
  item.progress = 0
  item.error = ''
  processQueue()
}

function clearQueue() {
  for (const item of queue.value) {
    URL.revokeObjectURL(item.preview)
  }
  queue.value = []
}

onUnmounted(() => {
  for (const item of queue.value) {
    URL.revokeObjectURL(item.preview)
  }
})
</script>
