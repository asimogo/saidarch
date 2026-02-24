<template>
  <footer class="py-8 px-6 border-t border-border-light dark:border-border-dark">
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
      <p class="text-small text-subtle-light dark:text-subtle-dark">
        {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>
      <span class="text-small text-subtle-light dark:text-subtle-dark">｜</span>
      <NuxtLink
        :to="localePath('/privacy')"
        class="text-small text-subtle-light dark:text-subtle-dark hover:text-bronze transition-colors"
      >
        {{ $t('footer.privacy') }}
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
