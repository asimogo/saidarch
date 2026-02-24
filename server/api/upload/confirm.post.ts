export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const { key } = await readBody(event)
  const config = useRuntimeConfig()

  if (!key || typeof key !== 'string' || key.includes('..')) {
    throw createError({ statusCode: 400, message: 'Invalid key' })
  }

  const publicUrl = `${config.public.r2PublicUrl}/${key}`
  return { url: publicUrl }
})
