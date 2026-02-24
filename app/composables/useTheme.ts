export const useTheme = () => {
  const themeCookie = useCookie<'light' | 'dark'>('said_theme', {
    maxAge: 60 * 60 * 24 * 365,
  })

  const theme = useState<'light' | 'dark'>('theme', () => themeCookie.value || 'light')

  const initTheme = async () => {
    // Cookie already set from previous visit — SSR is already correct
    if (themeCookie.value) {
      applyTheme(theme.value)
      return
    }

    // First visit: detect preference on client
    if (import.meta.client) {
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
        return
      }
    }

    // Timezone-based auto detection fallback
    try {
      const { get } = await useSiteSettings()
      const tz = get('timezone') || 'Asia/Phnom_Penh'
      const dayStart = Number(get('day_start_hour')) || 6
      const dayEnd = Number(get('day_end_hour')) || 18
      const now = new Date()
      const hour = Number(now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }))
      const isDaytime = hour >= dayStart && hour < dayEnd
      setTheme(isDaytime ? 'light' : 'dark')
    } catch {
      applyTheme(theme.value)
    }
  }

  const setTheme = (t: 'light' | 'dark') => {
    theme.value = t
    themeCookie.value = t
    applyTheme(t)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const applyTheme = (t: 'light' | 'dark') => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', t === 'dark')
    }
  }

  return { theme, toggleTheme, initTheme }
}
