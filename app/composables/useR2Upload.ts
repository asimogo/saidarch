const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface UploadOptions {
  folder: string
  onProgress?: (percent: number) => void
}

interface UploadResult {
  publicUrl: string
  key: string
}

export function useR2Upload() {
  const supabase = useSupabase()

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return '不支持的文件格式，请上传 JPEG、PNG 或 WebP 图片'
    }
    if (file.size > MAX_SIZE) {
      return '文件大小超过 10MB 限制'
    }
    return null
  }

  async function uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('登录已失效，请重新登录')
    }

    const presignRes = await $fetch<{ presignedUrl: string; publicUrl: string; key: string }>(
      '/api/upload/presign',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { fileName: file.name, folder: options.folder, contentType: file.type },
      },
    )

    options.onProgress?.(10)

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', presignRes.presignedUrl, true)
      xhr.setRequestHeader('Content-Type', file.type)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          options.onProgress?.(Math.round(10 + (event.loaded / event.total) * 85))
        }
      })

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          options.onProgress?.(100)
          resolve()
        } else {
          reject(new Error(`上传失败，状态码 ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error('网络错误，上传失败'))
      xhr.send(file)
    })

    return { publicUrl: presignRes.publicUrl, key: presignRes.key }
  }

  return { validateFile, uploadFile }
}
