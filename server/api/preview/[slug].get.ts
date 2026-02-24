export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const token = getQuery(event).token as string

  if (!slug || !token) {
    throw createError({ statusCode: 400, message: 'Missing slug or token' })
  }

  const supabase = useSupabaseAdmin()

  const { data: project } = await supabase
    .from('projects')
    .select('preview_token')
    .eq('slug', slug)
    .single()

  if (!project || project.preview_token !== token) {
    throw createError({ statusCode: 403, message: 'Invalid preview token' })
  }

  const { data } = await supabase
    .from('projects')
    .select('*, category:categories(*), project_images(*)')
    .eq('slug', slug)
    .single()

  return data
})
