<script setup>
import { onMounted } from 'vue'
import { useStore } from '@/stores'

const store = useStore()

onMounted(async () => {
  await store.fetchJobs()
  if (store.isEditor) await store.fetchApplications()
})
</script>

<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="welcome">Welcome back, <strong>{{ store.user?.name }}</strong> 👋</p>

    <div class="stats-grid">
      <div class="stat-card blue">
        <span class="stat-icon">💼</span>
        <div><span class="stat-num">{{ store.jobs.length }}</span><span class="stat-lbl">Active Jobs</span></div>
      </div>
      <div class="stat-card green">
        <span class="stat-icon">📋</span>
        <div><span class="stat-num">{{ store.totalApplications }}</span><span class="stat-lbl">Applications</span></div>
      </div>
      <div class="stat-card orange">
        <span class="stat-icon">⏳</span>
        <div><span class="stat-num">{{ store.pendingApplications }}</span><span class="stat-lbl">Pending</span></div>
      </div>
      <div class="stat-card purple">
        <span class="stat-icon">✅</span>
        <div><span class="stat-num">{{ store.acceptedApplications }}</span><span class="stat-lbl">Accepted</span></div>
      </div>
    </div>

    <div class="actions">
      <RouterLink to="/jobs" class="action-card">🔍 Browse Jobs</RouterLink>
      <RouterLink v-if="store.isEditor" to="/admin/applications" class="action-card">📊 Review Applications</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: 1.8rem; color: #1a3c5e; margin-bottom: 4px; }
.welcome    { color: #666; margin-bottom: 28px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
.stat-card  { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 12px; color: #fff; }
.stat-card.blue   { background: linear-gradient(135deg, #1a3c5e, #2980b9); }
.stat-card.green  { background: linear-gradient(135deg, #27ae60, #2ecc71); }
.stat-card.orange { background: linear-gradient(135deg, #e67e22, #f39c12); }
.stat-card.purple { background: linear-gradient(135deg, #8e44ad, #9b59b6); }
.stat-icon { font-size: 2rem; }
.stat-num  { font-size: 2rem; font-weight: 700; display: block; }
.stat-lbl  { font-size: 0.8rem; opacity: 0.85; }
.actions   { display: flex; gap: 16px; flex-wrap: wrap; }
.action-card { display: flex; align-items: center; gap: 10px; padding: 18px 24px; background: #fff; border-radius: 10px; text-decoration: none; color: #1a3c5e; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform .2s; }
.action-card:hover { transform: translateY(-2px); }
</style>