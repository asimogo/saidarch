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
