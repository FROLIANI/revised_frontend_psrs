<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores'

const store   = useStore()
const router  = useRouter()
const form    = ref({ name: '', email: '', password: '', password_confirmation: '' })
const error   = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value   = ''
  loading.value = true
  try {
    await store.register(form.value)
    router.push('/dashboard')
  } catch (e) {
    const errs = e.response?.data?.errors
    error.value = errs
      ? Object.values(errs).flat().join(' ')
      : e.response?.data?.message ?? 'Registration failed.'
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

      <h2>Create Account</h2>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.name" type="text" placeholder="Jina lako kamili" />
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input v-model="form.email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" placeholder="Min 8 characters" />
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input v-model="form.password_confirmation" type="password" placeholder="Repeat password" />
      </div>

      <button class="btn btn-primary w-full" :disabled="loading" @click="handleRegister">
        {{ loading ? 'Creating account…' : 'Register' }}
      </button>

      <div class="auth-links">
        <RouterLink to="/login">Already have an account? Sign in</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/auth.css';
</style>