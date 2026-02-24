<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[baseClasses, variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="[baseClasses, variantClasses[variant], sizeClasses[size]]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const baseClasses = 'inline-flex items-center justify-center tracking-wider uppercase transition-colors duration-300 font-sans disabled:opacity-50 disabled:pointer-events-none'

const variantClasses = {
  primary: 'bg-bronze text-white hover:bg-bronze-hover',
  outline: 'border border-deep-rock dark:border-sandstone text-deep-rock dark:text-sandstone hover:bg-deep-rock hover:text-sandstone dark:hover:bg-sandstone dark:hover:text-deep-rock',
  ghost: 'text-deep-rock dark:text-sandstone hover:text-bronze dark:hover:text-bronze',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-small',
  md: 'px-6 py-3 text-small',
  lg: 'px-8 py-4 text-body',
}
</script>
