<template>
  <div class="overflow-x-auto rounded-md border border-border-light dark:border-border-dark">
    <table class="w-full text-sm">
      <!-- Header -->
      <thead>
        <tr class="border-b border-border-light dark:border-border-dark bg-sandstone/50 dark:bg-deep-rock">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtle-light dark:text-subtle-dark"
            :style="col.width ? { width: col.width } : {}"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <!-- Loading State -->
        <template v-if="loading">
          <tr
            v-for="n in 5"
            :key="`skeleton-${n}`"
            class="border-b border-border-light dark:border-border-dark"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-3">
              <div class="h-4 bg-border-light dark:bg-border-dark rounded animate-pulse" />
            </td>
          </tr>
        </template>

        <!-- Empty State -->
        <tr v-else-if="!rows.length">
          <td
            :colspan="columns.length"
            class="px-4 py-12 text-center text-subtle-light dark:text-subtle-dark"
          >
            <svg class="mx-auto w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-sm">暂无数据</p>
          </td>
        </tr>

        <!-- Data Rows -->
        <template v-else>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="(row as any).id ?? rowIndex"
            class="border-b border-border-light dark:border-border-dark transition-colors hover:bg-sandstone/30 dark:hover:bg-deep-rock"
            :class="rowIndex % 2 === 1 ? 'bg-sandstone/20 dark:bg-deep-rock-soft/50' : 'bg-white dark:bg-deep-rock-soft'"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-3">
              <slot :name="`cell-${col.key}`" :row="row">
                <span class="text-deep-rock dark:text-sandstone">
                  {{ (row as any)[col.key] ?? '-' }}
                </span>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  width?: string
}

interface Props {
  columns: Column[]
  rows: Record<string, any>[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>
