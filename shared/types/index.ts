import type { Database } from './database'

// Table row type aliases
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type HeroSlide = Database['public']['Tables']['hero_slides']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectImage = Database['public']['Tables']['project_images']['Row']
export type TranslationPrompt = Database['public']['Tables']['translation_prompts']['Row']
export type PageContent = Database['public']['Tables']['page_contents']['Row']
export type SlugRedirect = Database['public']['Tables']['slug_redirects']['Row']

// Enum type aliases
export type PublishStatus = Database['public']['Enums']['publish_status_enum']
export type SectionType = Database['public']['Enums']['section_type_enum']

// Project with relations
export type ProjectWithRelations = Project & {
  category: Category | null
  project_images: ProjectImage[]
}

// Site settings map (key -> setting)
export type SiteSettingsMap = Record<string, SiteSetting>

