import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Components auto-import (no path prefix)
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  // Modules
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // Vite plugins (Tailwind CSS 4)
  vite: {
    plugins: [tailwindcss()],
  },

  // Runtime config (env variables)
  runtimeConfig: {
    // Server-only
    supabaseServiceKey: '',
    deepseekApiKey: '',
    r2AccessKeyId: '',
    r2SecretAccessKey: '',
    r2Endpoint: '',
    r2BucketName: '',
    revalidateSecret: '',
    // Client-accessible
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      r2PublicUrl: '',
      cfBeaconToken: '',
      siteUrl: '',
    },
  },

  // Hybrid rendering route rules
  routeRules: {
    '/': { prerender: true },
    '/zh': { prerender: true },
    '/projects': { isr: 60 },
    '/zh/projects': { isr: 60 },
    '/project/**': { isr: 60 },
    '/zh/project/**': { isr: 60 },
    '/preview/**': { ssr: false },
    '/privacy': { prerender: true },
    '/zh/privacy': { prerender: true },
    '/admin/**': { ssr: false },
  },

  // i18n
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'EN', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: '../i18n/locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'said_lang',
      redirectOn: 'root',
    },
  },

  // Nuxt Image
  image: {
    provider: 'ipx',
    format: ['webp', 'avif'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // App config
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Sitemap
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/zh/admin/**', '/preview/**'],
  },

  // Robots
  robots: {
    disallow: ['/admin', '/api', '/preview'],
  },
})
