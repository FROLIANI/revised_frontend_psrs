<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route   = useRoute()
const API     = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
const job     = ref(null)
const loading = ref(true)

const priority = computed(() => {
  if (!job.value) return 0
  const l = job.value.location.toLowerCase()
  if (l === 'remote') return 3
  if (l.includes('dar')) return 2
  return 1
})

const locClass     = (loc) => { const l = loc.toLowerCase(); if (l === 'remote') return 'loc-remote'; if (l.includes('dar')) return 'loc-dar'; return 'loc-other' }
const formatSalary = (v) => Number(v).toLocaleString()

onMounted(async () => {
  try { const { data } = await axios.get(`${API}/jobs/${route.params.id}`); job.value = data.data ?? data }
  catch {} finally { loading.value = false }
})
</script>

<template>
  <div class="detail-page">
    <RouterLink to="/jobs" class="back">← Back to Jobs</RouterLink>

    <div v-if="loading" class="loading">Loading…</div>

    <div v-else-if="job" class="card">
      <div class="header">
        <div>
          <span class="dept">{{ job.department }}</span>
          <h1>{{ job.title }}</h1>
          <div class="meta">
            <span class="loc-badge" :class="locClass(job.location)">📍 {{ job.location }}</span>
            <span class="salary-tag">💰 Tsh {{ formatSalary(job.salary) }}</span>
          </div>
        </div>
        <div class="priority-box">
          <span class="pri-num">+{{ priority }}</span>
          <span class="pri-lbl">Priority Points</span>
        </div>
      </div>

      <div v-if="job.description" class="section">
        <h3>Job Description</h3>
        <p>{{ job.description }}</p>
      </div>

      <div class="section">
        <h3>How Scoring Works</h3>
        <ul>
          <li>📄 Resume Quality Score — 1 to 10 points</li>
          <li>📍 Location Priority — +{{ priority }} points ({{ job.location }})</li>
          <li>🏆 Final Score = Resume Score + Location Priority</li>
        </ul>
      </div>

      <RouterLink :to="`/apply/${job.id}`" class="btn btn-primary">Apply for this Position →</RouterLink>
    </div>
  </div>
</template>



<style scoped>
.detail-page { max-width: 780px; margin: 0 auto; }
.back  { color: #1a3c5e; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-block; margin-bottom: 20px; }
.loading { text-align: center; padding: 40px; color: #666; }
.card  { background: #fff; border-radius: 14px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.dept  { font-size: 0.75rem; text-transform: uppercase; color: #999; font-weight: 600; }
.header h1 { font-size: 1.7rem; color: #1a3c5e; margin: 6px 0 12px; }
.meta  { display: flex; gap: 10px; flex-wrap: wrap; }
.loc-badge { font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
.loc-remote { background: #e8f5e9; color: #27ae60; }
.loc-dar    { background: #e3f2fd; color: #1565c0; }
.loc-other  { background: #fff3e0; color: #e67e22; }
.salary-tag { background: #f0faf4; color: #27ae60; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.priority-box { background: #1a3c5e; color: #fff; border-radius: 10px; padding: 16px 24px; text-align: center; min-width: 120px; }
.pri-num { font-size: 2.4rem; font-weight: 700; display: block; color: #4da6ff; }
.pri-lbl { font-size: 0.75rem; opacity: 0.8; }
.section { margin-bottom: 24px; }
.section h3 { color: #1a3c5e; margin-bottom: 10px; }
.section p  { color: #555; line-height: 1.6; }
.section ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.section li { background: #f4f6f9; border-radius: 6px; padding: 10px 14px; font-size: 0.9rem; }
.btn { padding: 12px 28px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; border: none; display: inline-flex; }
.btn-primary { background: #1a3c5e; color: #fff; }
.btn-primary:hover { background: #2980b9; }
</style>