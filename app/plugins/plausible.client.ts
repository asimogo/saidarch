declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (!config.public.plausibleDomain) return

  useHead({
    script: [
      {
        defer: true,
        'data-domain': config.public.plausibleDomain,
        'data-api': `${config.public.plausibleApiHost}/api/event`,
        src: `${config.public.plausibleApiHost}/js/script.js`,
      },
    ],
  })

  return {
    provide: {
      plausible: {
        trackEvent: (name: string, props?: Record<string, string>) => {
          if (window.plausible) {
            window.plausible(name, { props })
          }
        },
      },
    },
  }
})
