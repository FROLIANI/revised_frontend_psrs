<script setup>
import { useStore } from '@/stores'
import { useRouter } from 'vue-router'

const store  = useStore()
const router = useRouter()

async function handleLogout() {
  await store.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">
      <span class="nav-logo">🏛️</span>
      <span>PSRS Recruitment</span>
    </div>

    <div class="nav-links">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/jobs">Job Listings</RouterLink>
      <RouterLink v-if="store.isEditor" to="/admin/applications">Applications</RouterLink>
    </div>

    <div class="nav-user">
      <span class="badge" :class="store.user?.role">{{ store.user?.role }}</span>
      <span class="nav-name">{{ store.user?.name }}</span>
      <button class="btn-logout" @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a3c5e;
  color: #fff;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
}
.nav-logo {
  font-size: 1.4rem;
}
.nav-links {
  display: flex;
  gap: 24px;
}
.nav-links a {
  color: #cdd6e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}
.nav-links a.router-link-active {
  color: #fff;
  border-bottom: 2px solid #4da6ff;
  padding-bottom: 2px;
}
.nav-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-name {
  font-size: 0.875rem;
}
.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 700;
}
.badge.admin {
  background: #e74c3c;
}
.badge.editor {
  background: #f39c12;
}
.badge.viewer {
  background: #27ae60;
}
.btn-logout {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}
.btn-logout:hover {
  background: #c0392b;
}
</style>