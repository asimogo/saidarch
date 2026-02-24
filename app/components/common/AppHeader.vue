<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
    :class="scrolled ? 'bg-sandstone/90 dark:bg-deep-rock/90 backdrop-blur-md border-b border-border-light dark:border-border-dark' : 'bg-transparent'"
  >
    <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="z-35 flex items-center gap-2">
        <img v-if="logoUrl" :src="logoUrl" alt="SAID" class="h-8 w-auto" />
        <span class="font-heading text-xl tracking-[0.2em]">SAID</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <template v-for="item in navItems" :key="item.key">
          <a
            :href="item.href"
            class="text-small tracking-wider uppercase transition-colors relative py-1"
            :class="activeSection === item.key ? 'text-bronze' : 'text-subtle-light dark:text-subtle-dark hover:text-deep-rock dark:hover:text-sandstone'"
            @click.prevent="scrollToSection(item.href)"
          >
            {{ $t(`nav.${item.key}`) }}
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-bronze transition-transform origin-left"
              :class="activeSection === item.key ? 'scale-x-100' : 'scale-x-0'"
            />
          </a>
        </template>
      </div>

      <!-- Right controls -->
      <div class="hidden md:flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <!-- Mobile controls: language + theme -->
      <div class="md:hidden flex items-center gap-2 z-35">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <button
        class="md:hidden z-35 w-9 h-9 flex items-center justify-center"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <div class="w-5 flex flex-col gap-1.5">
          <span
            class="block h-px bg-current transition-all duration-300"
            :class="menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''"
          />
          <span
            class="block h-px bg-current transition-all duration-300"
            :class="menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''"
          />
        </div>
      </button>
    </nav>

    <!-- Mobile fullscreen menu -->
    <Transition name="menu">
      <div
        v-if="menuOpen"
        class="md:hidden fixed inset-0 z-30 bg-sandstone dark:bg-deep-rock flex flex-col items-center justify-center gap-8"
      >
        <NuxtLink
          :to="localePath('/')"
          class="font-heading text-h2 tracking-wider"
          @click="menuOpen = false"
        >
          {{ $t('nav.home') }}
        </NuxtLink>
        <template v-for="item in navItems" :key="item.key">
          <a
            :href="item.href"
            class="font-heading text-h2 tracking-wider"
            :class="activeSection === item.key ? 'text-bronze' : ''"
            @click.prevent="scrollToSection(item.href); menuOpen = false"
          >
            {{ $t(`nav.${item.key}`) }}
          </a>
        </template>
      </div>
    </Transition>
  </header>
  <!-- Spacer -->
  <div class="h-16" />
</template>

<script setup lang="ts">
import { NAV_ITEMS, SECTION_IDS } from '~/utils/constants'

const localePath = useLocalePath()
const route = useRoute()
const { activeSection } = useScrollSpy([...SECTION_IDS])
const { get } = await useSiteSettings()
const menuOpen = ref(false)
const scrolled = ref(false)

const { theme } = useTheme()
const navItems = NAV_ITEMS
const logoUrl = computed(() => {
  const logo = theme.value === 'dark' ? get('logo_dark_url') : get('logo_light_url')
  return logo || get('logo_light_url') || get('logo_dark_url') || ''
})


const scrollToSection = async (href: string) => {
  const homePath = localePath('/')
  if (route.path !== homePath) {
    await navigateTo({ path: homePath, hash: href })
    return
  }

  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
