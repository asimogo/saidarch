// Section IDs for scroll spy
export const SECTION_IDS = ['hero', 'projects', 'about', 'contact'] as const

// Navigation items
export const NAV_ITEMS = [
  { key: 'projects', href: '#projects' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: '#contact' },
] as const

// Project status options
export const PROJECT_STATUSES = ['designing', 'constructing', 'completed', 'awarded'] as const

// Publish status options
export const PUBLISH_STATUSES = ['draft', 'published', 'archived'] as const

// Settings group names
export const SETTINGS_GROUPS = ['brand', 'theme', 'contact', 'social', 'seo', 'about'] as const

// Breakpoints (matching Tailwind config)
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const
