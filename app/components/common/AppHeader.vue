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
        <div class="flex items-center gap-6 mt-8">
          <a
            v-if="telegramLink"
            :href="telegramLink"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 flex items-center justify-center text-subtle-light dark:text-subtle-dark hover:text-bronze transition-colors"
            aria-label="Telegram"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.012-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a
            v-if="whatsappLink"
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 flex items-center justify-center text-subtle-light dark:text-subtle-dark hover:text-bronze transition-colors"
            aria-label="WhatsApp"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
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
const telegramLink = computed(() => get('telegram_link'))
const whatsappLink = computed(() => get('whatsapp_link'))

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
