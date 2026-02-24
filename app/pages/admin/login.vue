<template>
  <div class="min-h-screen flex items-center justify-center bg-sandstone dark:bg-deep-rock px-6">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <h1 class="font-heading text-4xl tracking-[0.3em] mb-2">SAID</h1>
        <p class="text-small text-subtle-light dark:text-subtle-dark uppercase tracking-wider">Admin</p>
      </div>

      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-small uppercase tracking-wider mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3 bg-white dark:bg-deep-rock border border-border-light dark:border-border-dark text-body focus:border-bronze focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label for="password" class="block text-small uppercase tracking-wider mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3 bg-white dark:bg-deep-rock border border-border-light dark:border-border-dark text-body focus:border-bronze focus:outline-none transition-colors"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-bronze text-white text-small uppercase tracking-wider hover:bg-bronze-hover disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabase()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (authError) {
      error.value = authError.message
    } else {
      navigateTo('/admin')
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
