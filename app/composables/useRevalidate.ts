/**
 * Refresh the cached public pages for the given paths (en + zh) after content changes.
 * Best-effort: if it fails, ISR pages still refresh within their 60s window.
 */
export function useRevalidate() {
  const supabase = useSupabase()

  return async (paths: string[]) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const localizedPaths = paths.flatMap((p) => [p, p === '/' ? '/zh' : `/zh${p}`])

    await $fetch('/api/revalidate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { paths: localizedPaths },
    }).catch((err) => {
      console.warn('Failed to revalidate public pages:', err)
    })
  }
}
