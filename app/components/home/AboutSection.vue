<template>
  <section id="about" class="py-16 md:py-24">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <!-- Left: Avatar -->
        <div class="relative flex justify-center md:justify-start">
          <div class="relative w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-80 overflow-hidden">
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

          <div v-if="intro" class="relative">
            <!-- Collapsible content wrapper -->
            <div
              ref="contentRef"
              class="prose-intro text-subtle-light dark:text-subtle-dark overflow-hidden transition-[max-height] duration-500 ease-smooth"
              :style="{ maxHeight: expanded ? `${scrollH}px` : `${collapsedHeight}px` }"
              v-html="renderMarkdown(intro)"
            />

            <!-- Gradient fade overlay -->
            <div
              v-if="isOverflowing"
              class="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-sandstone dark:from-deep-rock to-transparent transition-opacity duration-300"
              :class="expanded ? 'opacity-0' : 'opacity-100'"
            />
          </div>

          <!-- Read more / Show less button -->
          <button
            v-if="isOverflowing"
            class="text-bronze hover:text-bronze-hover text-sm tracking-wide uppercase transition-colors duration-200"
            @click="expanded = !expanded"
          >
            {{ expanded ? $t('about.showLess') : $t('about.readMore') }}
          </button>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const collapsedHeight = 200

const props = defineProps<{
  settings: {
    get: (key: string) => string
  }
}>()

const avatarUrl = computed(() => props.settings.get('avatar_url'))
const intro = computed(() => props.settings.get('intro'))

const expanded = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const scrollH = ref(collapsedHeight)
const isOverflowing = ref(false)

function measure() {
  if (!contentRef.value) return
  scrollH.value = contentRef.value.scrollHeight
  isOverflowing.value = contentRef.value.scrollHeight > collapsedHeight
}

onMounted(measure)
watch(intro, () => nextTick(measure))
</script>
