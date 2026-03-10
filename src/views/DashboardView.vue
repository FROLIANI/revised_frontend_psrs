<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const auth  = useAuthStore()
const API   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
const stats = ref({ activeJobs: 0, total: 0, pending: 0, accepted: 0 })

onMounted(async () => {
  try {
    const [jobsRes, appsRes] = await Promise.all([
      axios.get(`${API}/jobs`),
      auth.isEditor ? axios.get(`${API}/applications`) : Promise.resolve({ data: { data: [] } }),
    ])
    const apps = appsRes.data?.data ?? []
    stats.value = {
      activeJobs: jobsRes.data?.total ?? 0,
      total:      appsRes.data?.total ?? apps.length,
      pending:    apps.filter(a => a.status === 'pending').length,
      accepted:   apps.filter(a => a.status === 'accepted').length,
    }
  } catch {}
})
</script>

<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="welcome">Welcome back, <strong>{{ auth.user?.name }}</strong> 👋</p>

    <div class="stats-grid">
      <div class="stat-card blue">
        <span class="stat-icon">💼</span>
        <div><span class="stat-num">{{ stats.activeJobs }}</span><span class="stat-lbl">Active Jobs</span></div>
      </div>
      <div class="stat-card green">
        <span class="stat-icon">📋</span>
        <div><span class="stat-num">{{ stats.total }}</span><span class="stat-lbl">Applications</span></div>
      </div>
      <div class="stat-card orange">
        <span class="stat-icon">⏳</span>
        <div><span class="stat-num">{{ stats.pending }}</span><span class="stat-lbl">Pending</span></div>
      </div>
      <div class="stat-card purple">
        <span class="stat-icon">✅</span>
        <div><span class="stat-num">{{ stats.accepted }}</span><span class="stat-lbl">Accepted</span></div>
      </div>
    </div>

    <div class="actions">
      <RouterLink to="/jobs" class="action-card">🔍 Browse Jobs</RouterLink>
      <RouterLink v-if="auth.isEditor" to="/admin/applications" class="action-card">📊 Review Applications</RouterLink>
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