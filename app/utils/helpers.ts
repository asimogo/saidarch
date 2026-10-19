import type { NuxtApp } from '#app'

/**
 * `getCachedData` for public content that changes without a redeploy.
 * On client-side navigation Nuxt reads ISR pages' data from `_payload.json?<buildId>`,
 * fetched with `cache: 'force-cache'`, so browsers keep the first copy they saw until
 * the next deploy. Only reuse payload data while hydrating; query fresh data otherwise.
 */
export const freshOnNavigation = (key: string, nuxtApp: NuxtApp) =>
  nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined

/**
 * Generate a URL-friendly slug from text
 */
export const slugify = (text: string): string => {
  const normalized = text
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || `project-${Date.now().toString(36)}`
}

/**
 * Format a date string for display
 */
export const formatDate = (date: string | Date, locale = 'en'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get current year
 */
export const getCurrentYear = (): number => new Date().getFullYear()

/**
 * Truncate text to a specified length
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '...'
}
