<template>
  <div class="min-h-screen bg-sandstone dark:bg-deep-rock transition-colors duration-300">
    <SkipNavigation />
    <AppHeader />
    <main id="main-content">
      <slot />
    </main>
    <AppFooter />
    <FloatingContact />
  </div>
</template>
