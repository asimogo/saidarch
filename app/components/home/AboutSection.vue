<template>
  <section id="about" class="py-24 md:py-32">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <!-- Left: Avatar -->
        <div class="relative flex justify-center">
          <div class="relative w-64 h-80 md:w-80 md:h-112 lg:w-96 lg:h-128 overflow-hidden">
            <NuxtImg
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="SAID Principal Designer"
              class="w-full h-full object-cover"
              format="webp"
              :quality="80"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-border-light dark:bg-border-dark flex items-center justify-center">
              <span class="block w-12 h-px bg-bronze/30" />
            </div>
          </div>
        </div>

        <!-- Right: Text content -->
        <div class="space-y-6">
          <h2 class="font-heading text-h2">{{ $t('nav.about') }}</h2>
          <div class="khmer-divider max-w-[120px]" />

          <div
            v-if="intro"
            class="prose-intro text-subtle-light dark:text-subtle-dark"
            v-html="renderMarkdown(intro)"
          />

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  settings: {
    get: (key: string) => string
  }
}>()

const avatarUrl = computed(() => props.settings.get('avatar_url'))
const intro = computed(() => props.settings.get('intro'))
</script>
