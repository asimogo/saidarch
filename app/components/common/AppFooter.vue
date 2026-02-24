<template>
  <footer class="py-8 px-6 border-t border-border-light dark:border-border-dark">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-small text-subtle-light dark:text-subtle-dark">
        {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>
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
