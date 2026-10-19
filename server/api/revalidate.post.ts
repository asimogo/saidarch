export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event).catch(() => ({}))
  const secret = typeof body?.secret === 'string' ? body.secret : ''
  const rawPaths = Array.isArray(body?.paths) ? body.paths : []

  const hasValidSecret = Boolean(config.revalidateSecret) && secret === config.revalidateSecret
  if (!hasValidSecret) {
    await requireAdminUser(event)
  }

  if (!config.revalidateSecret) {
    throw createError({ statusCode: 500, message: 'NUXT_REVALIDATE_SECRET is not configured' })
  }

  const paths = [...new Set(rawPaths
    .filter((p): p is string => typeof p === 'string')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (p.startsWith('/') ? p : `/${p}`)))]

  if (!paths.length) {
    throw createError({ statusCode: 400, message: 'Missing paths' })
  }

  // Vercel caches each ISR page and, separately, the `_payload.json?<buildId>`
  // the client hydrates from. A request carrying the bypass token re-renders
  // and replaces the cached copy, so refresh both.
  const origin = getRequestURL(event, { xForwardedHost: true }).origin
  const payloadSuffix = `_payload.json?${config.app.buildId}`
  const targets = paths.flatMap((p) => [p, `${p.replace(/\/$/, '')}/${payloadSuffix}`])

  const results = await Promise.all(targets.map(async (target) => {
    const url = new URL(target, origin)
    if (url.origin !== origin) {
      return { path: target, status: 400, cache: null }
    }
    try {
      const res = await fetch(url, {
        headers: { 'x-prerender-revalidate': config.revalidateSecret },
        redirect: 'manual',
      })
      // Read to the end so the streamed response is fully rendered and cached
      await res.arrayBuffer()
      return { path: target, status: res.status, cache: res.headers.get('x-vercel-cache') }
    } catch {
      return { path: target, status: 0, cache: null }
    }
  }))

  return {
    revalidated: results.every((r) => r.status > 0 && r.status < 400),
    results,
  }
})
