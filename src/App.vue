<script setup>
import { useStore } from '@/stores'
import Navbar from '@/components/Navbar.vue'

const store = useStore()
</script>

<template>
  <div id="app">
    <Navbar v-if="store.isLoggedIn" />
    <main class="main-content" :class="{ 'with-nav': store.isLoggedIn }">
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