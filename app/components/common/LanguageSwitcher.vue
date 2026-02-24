<template>
  <button
    class="flex items-center gap-1 text-small tracking-wider hover:text-bronze transition-colors"
    @click="toggleLocale"
  >
    <span class="text-subtle-light dark:text-subtle-dark">{{ locale === 'en' ? 'EN' : '中' }}</span>
  </button>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const toggleLocale = () => {
  const next = locale.value === 'en' ? 'zh' : 'en'
  navigateTo(switchLocalePath(next))
}
</script>
