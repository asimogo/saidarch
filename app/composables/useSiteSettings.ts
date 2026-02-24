import type { SiteSettingsMap } from '~/shared/types'

export const useSiteSettings = async () => {
  const supabase = useSupabase()
  const { locale } = useI18n()

  const { data } = await useAsyncData('site-settings', async () => {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('*')
      .order('sort_order')

    if (!settings) return {} as SiteSettingsMap

    const map: SiteSettingsMap = {}
    for (const s of settings) {
      map[s.key] = s
    }
    return map
  })

  const get = (key: string): string => {
    if (!data.value) return ''
    const setting = data.value[key]
    if (!setting) return ''
    const primary = locale.value === 'zh' ? setting.value_zh : setting.value_en
    const fallback = locale.value === 'zh' ? setting.value_en : setting.value_zh
    return primary || fallback || ''
  }

  const getRaw = (key: string) => {
    return data.value?.[key] ?? null
  }

  return { settings: data, get, getRaw }
}
