export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          key: string
          value_zh: string | null
          value_en: string | null
          value_km: string | null
          type: 'text' | 'image' | 'json' | 'number'
          group_name: 'brand' | 'contact' | 'seo' | 'theme' | 'about' | 'social' | 'general'
          description: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value_zh?: string | null
          value_en?: string | null
          value_km?: string | null
          type?: 'text' | 'image' | 'json' | 'number'
          group_name?: 'brand' | 'contact' | 'seo' | 'theme' | 'about' | 'social' | 'general'
          description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value_zh?: string | null
          value_en?: string | null
          value_km?: string | null
          type?: 'text' | 'image' | 'json' | 'number'
          group_name?: 'brand' | 'contact' | 'seo' | 'theme' | 'about' | 'social' | 'general'
          description?: string | null
          sort_order?: number
          updated_at?: string
        }
      }
      hero_slides: {
        Row: {
          id: string
          image_url: string
          title_zh: string | null
          title_en: string | null
          subtitle_zh: string | null
          subtitle_en: string | null
          cta_text_zh: string | null
          cta_text_en: string | null
          cta_link: string | null
          project_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title_zh?: string | null
          title_en?: string | null
          subtitle_zh?: string | null
          subtitle_en?: string | null
          cta_text_zh?: string | null
          cta_text_en?: string | null
          cta_link?: string | null
          project_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title_zh?: string | null
          title_en?: string | null
          subtitle_zh?: string | null
          subtitle_en?: string | null
          cta_text_zh?: string | null
          cta_text_en?: string | null
          cta_link?: string | null
          project_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name_zh: string
          name_en: string
          name_km: string | null
          slug: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_zh: string
          name_en: string
          name_km?: string | null
          slug: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_zh?: string
          name_en?: string
          name_km?: string | null
          slug?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title_zh: string
          title_en: string | null
          slug: string
          cover_url: string | null
          category_id: string | null
          location: string | null
          area: string | null
          year: number | null
          description_zh: string | null
          description_en: string | null
          seo_title_zh: string | null
          seo_title_en: string | null
          seo_description_zh: string | null
          seo_description_en: string | null
          og_image_url: string | null
          sort_order: number
          is_featured: boolean
          publish_status: Database['public']['Enums']['publish_status_enum']
          preview_token: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_zh: string
          title_en?: string | null
          slug: string
          cover_url?: string | null
          category_id?: string | null
          location?: string | null
          area?: string | null
          year?: number | null
          description_zh?: string | null
          description_en?: string | null
          seo_title_zh?: string | null
          seo_title_en?: string | null
          seo_description_zh?: string | null
          seo_description_en?: string | null
          og_image_url?: string | null
          sort_order?: number
          is_featured?: boolean
          publish_status?: Database['public']['Enums']['publish_status_enum']
          preview_token?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_zh?: string
          title_en?: string | null
          slug?: string
          cover_url?: string | null
          category_id?: string | null
          location?: string | null
          area?: string | null
          year?: number | null
          description_zh?: string | null
          description_en?: string | null
          seo_title_zh?: string | null
          seo_title_en?: string | null
          seo_description_zh?: string | null
          seo_description_en?: string | null
          og_image_url?: string | null
          sort_order?: number
          is_featured?: boolean
          publish_status?: Database['public']['Enums']['publish_status_enum']
          preview_token?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          image_url: string
          sort_order: number
          caption_zh: string | null
          caption_en: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          sort_order?: number
          caption_zh?: string | null
          caption_en?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          image_url?: string
          sort_order?: number
          caption_zh?: string | null
          caption_en?: string | null
          created_at?: string
        }
      }
      translation_prompts: {
        Row: {
          id: string
          section_type: Database['public']['Enums']['section_type_enum']
          prompt_text: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_type: Database['public']['Enums']['section_type_enum']
          prompt_text: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_type?: Database['public']['Enums']['section_type_enum']
          prompt_text?: string
          updated_at?: string
        }
      }
      page_contents: {
        Row: {
          id: string
          slug: string
          title_zh: string | null
          title_en: string | null
          content_zh: string | null
          content_en: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_zh?: string | null
          title_en?: string | null
          content_zh?: string | null
          content_en?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_zh?: string | null
          title_en?: string | null
          content_zh?: string | null
          content_en?: string | null
          updated_at?: string
        }
      }
      slug_redirects: {
        Row: {
          id: string
          old_slug: string
          new_slug: string
          created_at: string
        }
        Insert: {
          id?: string
          old_slug: string
          new_slug: string
          created_at?: string
        }
        Update: {
          id?: string
          old_slug?: string
          new_slug?: string
          created_at?: string
        }
      }
    }
    Enums: {
      publish_status_enum: 'draft' | 'published' | 'archived'
      section_type_enum: 'project' | 'brand' | 'about' | 'contact' | 'hero' | 'general'
    }
  }
}
