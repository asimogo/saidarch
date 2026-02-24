export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event).catch(() => ({}))
  const secret = typeof body?.secret === 'string' ? body.secret : ''
  const rawPaths = Array.isArray(body?.paths) ? body.paths : []

  const hasValidSecret = Boolean(config.revalidateSecret) && secret === config.revalidateSecret
  if (!hasValidSecret) {
    await requireAdminUser(event)
  }

  const paths = [...new Set(rawPaths
    .filter((p): p is string => typeof p === 'string')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (p.startsWith('/') ? p : `/${p}`)))]

  if (!paths.length) {
    throw createError({ statusCode: 400, message: 'Missing paths' })
  }

  for (const path of paths) {
    const storage = useStorage('cache:nitro:routes')
    await storage.removeItem(path)
    await storage.removeItem(`${path}/`)
    await storage.removeItem(`${path}/_payload.json`)
  }

  return { revalidated: true, paths }
})
