<template>
  <div
    v-if="!hideButton"
    class="fixed bottom-6 right-6 z-50"
  >
    <!-- Expanded menu -->
    <Transition name="float-menu">
      <div v-if="expanded" class="absolute bottom-14 right-0 flex flex-col gap-3 mb-2">
        <a
          v-if="telegram"
          :href="telegram"
          target="_blank"
          rel="noopener noreferrer"
          class="w-11 h-11 flex items-center justify-center bg-white dark:bg-deep-rock shadow-medium rounded-full text-deep-rock dark:text-sandstone hover:text-bronze dark:hover:text-bronze transition-colors"
          aria-label="Telegram"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
        <a
          v-if="whatsapp"
          :href="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="w-11 h-11 flex items-center justify-center bg-white dark:bg-deep-rock shadow-medium rounded-full text-deep-rock dark:text-sandstone hover:text-bronze dark:hover:text-bronze transition-colors"
          aria-label="WhatsApp"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.607.607l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.726-6.393-1.966l-.446-.312-2.638.885.885-2.638-.312-.446A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>
        <a
          v-if="emailAddr"
          :href="`mailto:${emailAddr}`"
          class="w-11 h-11 flex items-center justify-center bg-white dark:bg-deep-rock shadow-medium rounded-full text-deep-rock dark:text-sandstone hover:text-bronze dark:hover:text-bronze transition-colors"
          aria-label="Email"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </Transition>

    <!-- Main button -->
    <button
      class="w-12 h-12 flex items-center justify-center bg-bronze hover:bg-bronze-hover text-white rounded-full shadow-elevated transition-all duration-300"
      :class="expanded ? 'rotate-45' : ''"
      aria-label="Contact us"
      @click="expanded = !expanded"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false)
const hideButton = ref(false)

// Get contact info from site settings
let settingsGet: ((key: string) => string) | null = null
try {
  const settings = await useSiteSettings()
  settingsGet = settings.get
} catch { /* Supabase not configured */ }
const telegram = computed(() => settingsGet?.('telegram_link') || '')
const whatsapp = computed(() => settingsGet?.('whatsapp_link') || '')
const emailAddr = computed(() => settingsGet?.('email') || '')

// Hide when contact section is in view
const { activeSection } = useScrollSpy(['contact'])
watch(activeSection, (val) => {
  hideButton.value = val === 'contact'
  if (hideButton.value) expanded.value = false
})
</script>

<style scoped>
.float-menu-enter-active,
.float-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.float-menu-enter-from,
.float-menu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
