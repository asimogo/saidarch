<template>
  <div class="min-h-screen py-section px-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="font-heading text-h1 mb-8">{{ l(page, 'title') || $t('footer.privacy') }}</h1>
      <hr class="max-w-xs mb-12" />
      <div class="prose prose-lg dark:prose-invert max-w-none text-subtle-light dark:text-subtle-dark">
        {{ l(page, 'content') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()
const { l } = useLocalizedField()

const { data: page } = await useAsyncData('privacy-page', () =>
  supabase
    .from('page_contents')
    .select('*')
    .eq('slug', 'privacy')
    .single()
    .then(({ data }) => data),
)

useSeoMeta({
  title: 'Privacy Policy | SAID',
})
</script>
