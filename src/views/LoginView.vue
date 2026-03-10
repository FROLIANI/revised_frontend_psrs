<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1>PSRS</h1>
        <p>Public Service Recruitment Secretariat</p>
      </div>

      <h2>Sign In</h2>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="form-group">
        <label>Email Address</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          @keyup.enter="handleLogin"
        />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          @keyup.enter="handleLogin"
        />
      </div>

      <button class="btn btn-primary w-full" :disabled="loading" @click="handleLogin">
        {{ loading ? 'Signing in…' : 'Sign In' }}
      </button>

      <div class="auth-links">
        <RouterLink to="/forgot-password">Forgot password?</RouterLink>
        <RouterLink to="/register">Create account</RouterLink>
      </div>
    </div>
  </div>
</template>



<style scoped>
@import '../assets/auth.css';
</style>