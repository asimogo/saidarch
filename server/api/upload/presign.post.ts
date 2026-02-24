export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const { fileName, contentType, folder } = await readBody(event)
  const config = useRuntimeConfig()

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  if (!contentType || typeof contentType !== 'string' || !extMap[contentType]) {
    throw createError({ statusCode: 400, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' })
  }

  const safeFolder = (typeof folder === 'string' ? folder : 'uploads')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '') || 'uploads'

  const safeName = (typeof fileName === 'string' ? fileName : 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image'

  const ext = extMap[contentType]
  const key = `${safeFolder}/${Date.now()}-${safeName}.${ext}`
  const presignedUrl = await generatePresignedUrl(key, contentType)
  const publicUrl = `${config.public.r2PublicUrl}/${key}`

  return { presignedUrl, url: presignedUrl, publicUrl, key }
})
