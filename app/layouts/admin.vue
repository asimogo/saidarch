<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <AdminSidebar />
    <div class="flex-1 flex flex-col overflow-hidden ml-60">
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
