import type { H3Event } from 'h3'

export const requireAdminUser = async (event: H3Event) => {
  const authorization = getHeader(event, 'authorization')

  if (!authorization?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authorization.slice('Bearer '.length).trim()
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const supabase = useSupabaseAdmin()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  return data.user
}
