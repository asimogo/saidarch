export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const match = url.pathname.match(/^\/(zh\/)?project\/([^/]+)$/)

  if (match) {
    const slug = match[2]
    const supabase = useSupabaseAdmin()
    const { data } = await supabase
      .from('slug_redirects')
      .select('new_slug')
      .eq('old_slug', slug)
      .single()

    if (data) {
      const prefix = match[1] || ''
      return sendRedirect(event, `/${prefix}project/${data.new_slug}`, 301)
    }
  }
})
