<template>
  <section class="max-w-4xl mx-auto px-6 py-8 flex items-center gap-4">
    <span class="text-small uppercase tracking-wider text-subtle-light dark:text-subtle-dark">Share</span>
    <a
      :href="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      class="w-9 h-9 flex items-center justify-center border border-border-light dark:border-border-dark hover:border-bronze hover:text-bronze transition-colors"
      aria-label="Share on Facebook"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a
      :href="`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(title)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="w-9 h-9 flex items-center justify-center border border-border-light dark:border-border-dark hover:border-bronze hover:text-bronze transition-colors"
      aria-label="Share on X"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string
  title: string
}>()

const config = useRuntimeConfig()
const shareUrl = computed(() => encodeURIComponent(`${config.public.siteUrl}/project/${props.slug}`))
</script>
