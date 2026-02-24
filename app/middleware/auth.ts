export default defineNuxtRouteMiddleware(async (to) => {
  const isAdminRoute = /^\/(?:[a-z]{2}\/)?admin(?:\/|$)/.test(to.path)
  if (!isAdminRoute) return

  const isAdminLoginRoute = /^\/(?:[a-z]{2}\/)?admin\/login\/?$/.test(to.path)
  if (isAdminLoginRoute) return

  const supabase = useSupabase()
  const localePath = useLocalePath()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo(localePath('/admin/login'))
  }
})
