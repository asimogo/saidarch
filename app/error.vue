<template>
  <div class="min-h-screen flex items-center justify-center bg-sandstone dark:bg-deep-rock px-6">
    <div class="text-center max-w-md">
      <h1 class="font-heading text-h1 text-deep-rock dark:text-sandstone mb-4">
        {{ error?.statusCode || 500 }}
      </h1>
      <hr class="my-8" />
      <p class="text-body text-subtle-light dark:text-subtle-dark mb-8">
        {{ error?.statusCode === 404 ? $t('error.notFoundDesc') : (error?.message || 'An error occurred') }}
      </p>
      <NuxtLink
        to="/"
        class="inline-block px-6 py-3 bg-bronze text-white text-sm tracking-wider uppercase hover:bg-bronze-hover transition-colors"
      >
        {{ $t('error.backHome') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    message: string
  } | null
}>()
</script>
