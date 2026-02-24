export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  const config = useRuntimeConfig()

  // Fetch projects with their images for image sitemap
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at, title_en, title_zh, cover_url, project_images(image_url, caption_en, caption_zh)')
    .eq('publish_status', 'published')

  const urls = []

  for (const p of projects || []) {
    // Build image entries for sitemap
    const images: Array<{ loc: string; title?: string; caption?: string }> = []
    if (p.cover_url) {
      images.push({ loc: p.cover_url, title: p.title_en || p.title_zh || '' })
    }
    for (const img of (p as any).project_images || []) {
      if (img.image_url) {
        images.push({
          loc: img.image_url,
          caption: img.caption_en || img.caption_zh || '',
        })
      }
    }

    urls.push({
      loc: `/project/${p.slug}`,
      lastmod: p.updated_at,
      changefreq: 'monthly',
      priority: 0.8,
      alternatives: [
        { hreflang: 'en', href: `${config.public.siteUrl}/project/${p.slug}` },
        { hreflang: 'zh', href: `${config.public.siteUrl}/zh/project/${p.slug}` },
      ],
      images,
    })
    urls.push({
      loc: `/zh/project/${p.slug}`,
      lastmod: p.updated_at,
      changefreq: 'monthly',
      priority: 0.8,
      images,
    })
  }

  return urls
})
