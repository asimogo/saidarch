export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')
  const manualOverride = useState<boolean>('themeManual', () => false)

  const initTheme = async () => {
    // 1. Check localStorage manual preference
    if (import.meta.client) {
      const saved = localStorage.getItem('said_theme')
      if (saved === 'light' || saved === 'dark') {
        theme.value = saved
        manualOverride.value = true
        applyTheme(saved)
        return
      }
    }
    // 2. Check system preference
    if (import.meta.client && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark.matches) {
        theme.value = 'dark'
        applyTheme('dark')
        return
      }
      if (prefersDark.media !== 'not all') {
        theme.value = 'light'
        applyTheme('light')
        return
      }
    }
    // 3. Timezone-based auto detection
    const { get } = await useSiteSettings()
    const tz = get('timezone') || 'Asia/Phnom_Penh'
    const dayStart = Number(get('day_start_hour')) || 6
    const dayEnd = Number(get('day_end_hour')) || 18
    const now = new Date()
    const hour = Number(now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }))
    const isDaytime = hour >= dayStart && hour < dayEnd
    theme.value = isDaytime ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
    manualOverride.value = true
    if (import.meta.client) {
      localStorage.setItem('said_theme', newTheme)
    }
    applyTheme(newTheme)
  }

  const applyTheme = (t: 'light' | 'dark') => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', t === 'dark')
    }
  }

  return { theme, toggleTheme, initTheme }
}
