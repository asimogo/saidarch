<template>
  <div class="space-y-3">
    <!-- Current Image Preview -->
    <div
      v-if="modelValue"
      class="relative group rounded-md overflow-hidden border border-border-light dark:border-border-dark"
    >
      <img
        :src="modelValue"
        alt="Current image"
        class="w-full h-48 object-cover"
      />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          class="px-3 py-1.5 bg-white rounded-md text-sm font-medium text-deep-rock hover:bg-sandstone transition-colors"
          @click="triggerFileInput"
        >
          更换图片
        </button>
      </div>
    </div>

    <!-- Upload Zone -->
    <div
      v-else
      class="relative border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors"
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
        点击上传或拖拽图片到此处
      </p>
      <p class="text-xs text-subtle-light/60 dark:text-subtle-dark/60 mt-1">
        支持 JPEG, PNG, WebP，最大 10MB
      </p>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="space-y-1">
      <div class="flex items-center justify-between text-xs text-subtle-light dark:text-subtle-dark">
        <span>上传中...</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full h-1.5 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
        <div
          class="h-full bg-bronze rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  folder: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const supabase = useSupabase()
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const error = ref('')

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
  // Reset input so same file can be re-selected
  if (target) target.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '不支持的文件格式，请上传 JPEG、PNG 或 WebP 图片'
  }
  if (file.size > MAX_SIZE) {
    return '文件大小超过 10MB 限制'
  }
  return null
}

async function uploadFile(file: File) {
  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    return
  }

  error.value = ''
  uploading.value = true
  progress.value = 0

  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('登录已失效，请重新登录')
    }

    // Get presigned URL
    const presignRes = await $fetch<{ presignedUrl: string; publicUrl: string }>('/api/upload/presign', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { fileName: file.name, folder: props.folder, contentType: file.type },
    })

    // Upload directly to R2 using presigned URL with progress tracking
    progress.value = 10

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', presignRes.presignedUrl, true)
    xhr.setRequestHeader('Content-Type', file.type)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        progress.value = Math.round(10 + (event.loaded / event.total) * 85)
      }
    })

    await new Promise<void>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error('Upload network error'))
      xhr.send(file)
    })

    progress.value = 100
    emit('update:modelValue', presignRes.publicUrl)
  } catch (err: any) {
    error.value = err?.message || '上传失败，请重试'
  } finally {
    uploading.value = false
    progress.value = 0
  }
}
</script>
