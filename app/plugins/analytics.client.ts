export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const route = useRoute()

  if (!config.public.cfBeaconToken) return
  if (route.path.startsWith('/admin')) return

  useHead({
    script: [
      {
        defer: true,
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': JSON.stringify({ token: config.public.cfBeaconToken }),
      },
    ],
  })
})
