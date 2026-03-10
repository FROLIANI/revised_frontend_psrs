<script setup>
import { ref } from 'vue'
import { useStore } from '@/stores'

const store = useStore()
const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await store.forgotPassword(email.value)
    success.value = res.message ?? 'Reset link sent. Check your email.'
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Something went wrong.'
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

      <h2>Reset Password</h2>
      <p style="color: #888; font-size: 0.875rem; margin-bottom: 16px">
        Enter your email and we'll send a reset link.
      </p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div class="form-group">
        <label>Email Address</label>
        <input v-model="email" type="email" placeholder="you@example.com" @keyup.enter="submit" />
      </div>

      <button class="btn btn-primary w-full" :disabled="loading" @click="submit">
        {{ loading ? 'Sending…' : 'Send Reset Link' }}
      </button>

      <div class="auth-links">
        <RouterLink to="/login">← Back to Sign In</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/auth.css';
</style>