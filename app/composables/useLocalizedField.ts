export const useLocalizedField = () => {
  const { locale } = useI18n()

  const l = (obj: any, field: string): string => {
    if (!obj) return ''
    const primary = locale.value === 'zh' ? `${field}_zh` : `${field}_en`
    const fallback = locale.value === 'zh' ? `${field}_en` : `${field}_zh`
    return obj[primary] || obj[fallback] || ''
  }

  return { l }
}
