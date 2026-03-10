<script setup>
import { useAuthStore } from './stores/auth'
import Navbar from '@/components/Navbar.vue'

const auth = useAuthStore()
</script>

<template>
  <div id="app">
    <Navbar v-if="auth.isLoggedIn" />
    <main class="main-content" :class="{ 'with-nav': auth.isLoggedIn }">
      <RouterView />
    </main>
  </div>
</template>



<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f6f9;
  color: #333;
}
.main-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.main-content.with-nav {
  padding-top: 88px;
}
</style>