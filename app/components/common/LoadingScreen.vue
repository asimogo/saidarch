<template>
  <Transition name="loading">
    <div
      v-if="visible"
      class="fixed inset-0 z-[100] bg-sandstone dark:bg-deep-rock flex items-center justify-center"
    >
      <div class="text-center">
        <div class="font-heading text-4xl md:text-5xl tracking-[0.3em] animate-pulse">
          SAID
        </div>
        <div class="mt-4 w-16 h-px bg-bronze mx-auto" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(true)

onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 1200)
})
</script>

<style scoped>
.loading-leave-active {
  transition: opacity 0.6s ease;
}
.loading-leave-to {
  opacity: 0;
}
</style>
