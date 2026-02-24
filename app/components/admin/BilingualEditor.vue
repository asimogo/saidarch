<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-deep-rock dark:text-sandstone">
      {{ label }}
    </label>
    <div class="grid grid-cols-2 gap-4">
      <!-- Chinese -->
      <div>
        <span class="block text-xs text-subtle-light dark:text-subtle-dark mb-1">中文</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValueZh"
          rows="6"
          class="w-full rounded-md border border-border-light bg-white px-3 py-2 text-sm text-deep-rock placeholder:text-subtle-light/50 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze dark:border-border-dark dark:bg-deep-rock dark:text-sandstone dark:placeholder:text-subtle-dark/50"
          :placeholder="`请输入${label || ''}中文内容`"
          @input="$emit('update:modelValueZh', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :value="modelValueZh"
          type="text"
          class="w-full rounded-md border border-border-light bg-white px-3 py-2 text-sm text-deep-rock placeholder:text-subtle-light/50 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze dark:border-border-dark dark:bg-deep-rock dark:text-sandstone dark:placeholder:text-subtle-dark/50"
          :placeholder="`请输入${label || ''}中文内容`"
          @input="$emit('update:modelValueZh', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- English -->
      <div>
        <span class="block text-xs text-subtle-light dark:text-subtle-dark mb-1">English</span>
        <textarea
          v-if="type === 'textarea'"
          :value="modelValueEn"
          rows="6"
          class="w-full rounded-md border border-border-light bg-white px-3 py-2 text-sm text-deep-rock placeholder:text-subtle-light/50 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze dark:border-border-dark dark:bg-deep-rock dark:text-sandstone dark:placeholder:text-subtle-dark/50"
          :placeholder="`Enter ${label || ''} in English`"
          @input="$emit('update:modelValueEn', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :value="modelValueEn"
          type="text"
          class="w-full rounded-md border border-border-light bg-white px-3 py-2 text-sm text-deep-rock placeholder:text-subtle-light/50 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze dark:border-border-dark dark:bg-deep-rock dark:text-sandstone dark:placeholder:text-subtle-dark/50"
          :placeholder="`Enter ${label || ''} in English`"
          @input="$emit('update:modelValueEn', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValueZh: string
  modelValueEn: string
  label?: string
  type?: 'input' | 'textarea'
}

withDefaults(defineProps<Props>(), {
  label: '',
  type: 'input',
})

defineEmits<{
  'update:modelValueZh': [value: string]
  'update:modelValueEn': [value: string]
}>()
</script>
