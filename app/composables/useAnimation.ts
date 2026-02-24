export const useAnimation = () => {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    prefersReducedMotion.value =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const fadeInOnScroll = (el: HTMLElement, options = {}) => {
    if (prefersReducedMotion.value) return
    const { gsap, ScrollTrigger } = useNuxtApp().$gsap as any
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      ...options,
    })
  }

  const kenBurns = (el: HTMLElement) => {
    if (prefersReducedMotion.value) return
    const { gsap } = useNuxtApp().$gsap as any
    gsap.fromTo(el,
      { scale: 1 },
      { scale: 1.05, duration: 8, ease: 'none', repeat: -1, yoyo: true },
    )
  }

  return { fadeInOnScroll, kenBurns, prefersReducedMotion }
}
