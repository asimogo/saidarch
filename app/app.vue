<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()
const { getRaw } = await useSiteSettings()

// Dynamic favicon from uploaded logo
const faviconUrl = computed(() => {
  const logo = getRaw('logo_light_url')
  return logo?.value_zh || logo?.value_en || '/favicon.ico'
})

// Dynamic html lang attribute + JSON-LD structured data
useHead({
  htmlAttrs: { lang: () => locale.value === 'zh' ? 'zh-CN' : 'en' },
  titleTemplate: (title) => title ? `${title} | SAID` : 'SAID | Summit Architecture & Interior Design',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: () => faviconUrl.value },
  ],
  script: [
    {
      key: 'theme-init',
      innerHTML: `(function(){var m=document.cookie.match(/said_theme=(light|dark)/);var t=m?m[1]:null;if(!t&&window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches)t="dark";if(t==="dark")document.documentElement.classList.add("dark")})()`,
      tagPosition: 'head',
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness'],
        name: 'SAID | Summit Architecture & Interior Design',
        alternateName: '上境设计',
        url: config.public.siteUrl || 'https://saidarch.com',
        logo: `${config.public.siteUrl || 'https://saidarch.com'}/favicon.ico`,
        description: 'A boutique architecture and interior design studio specializing in luxury residences, premium offices, star-rated hotels, and high-end apartments in Phnom Penh and Sihanoukville, Cambodia.',
        '@id': `${config.public.siteUrl || 'https://saidarch.com'}/#organization`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Phnom Penh',
          addressCountry: 'KH',
        },
        areaServed: [
          { '@type': 'City', name: 'Phnom Penh' },
          { '@type': 'City', name: 'Sihanoukville' },
        ],
        knowsLanguage: ['en', 'zh'],
        priceRange: '$$$',
      }),
    },
  ],
})

// Initialize theme on client
if (import.meta.client) {
  const { initTheme } = useTheme()
  onMounted(() => {
    initTheme()
  })
}
</script>
