<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <h1 class="font-heading text-h1 mb-4">404</h1>
      <hr class="max-w-xs mx-auto my-8" />
      <p class="text-body text-subtle-light dark:text-subtle-dark mb-8">
        {{ $t('error.notFoundDesc') }}
      </p>
      <BaseButton variant="primary" to="/">
        {{ $t('error.backHome') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '404 - Page Not Found | SAID',
})
</script>
