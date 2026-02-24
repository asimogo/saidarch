<template>
  <section id="about" class="py-section">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <!-- Left: Avatar -->
        <div class="relative flex justify-center">
          <div class="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden">
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

          <p v-if="intro" class="text-body leading-relaxed text-subtle-light dark:text-subtle-dark">
            {{ intro }}
          </p>

          <div v-if="teamDesc" class="space-y-2">
            <p class="text-body leading-relaxed text-subtle-light dark:text-subtle-dark">
              {{ teamDesc }}
            </p>
          </div>

          <div v-if="services" class="pt-4">
            <h3 class="text-small uppercase tracking-wider text-bronze mb-2">Services</h3>
            <p class="text-body text-subtle-light dark:text-subtle-dark">{{ services }}</p>
          </div>

          <div v-if="areas" class="pt-2">
            <h3 class="text-small uppercase tracking-wider text-bronze mb-2">Areas</h3>
            <p class="text-body text-subtle-light dark:text-subtle-dark">{{ areas }}</p>
          </div>
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
const teamDesc = computed(() => props.settings.get('team_desc'))
const services = computed(() => props.settings.get('services'))
const areas = computed(() => props.settings.get('areas'))
</script>
