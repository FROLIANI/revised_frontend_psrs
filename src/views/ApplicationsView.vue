
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API          = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
const applications = ref([])
const loading      = ref(true)
const search       = ref('')
const statusFilter = ref('')

const summaryStats = computed(() => {
  const a = applications.value
  return [
    { label: 'Total',    count: a.length,                                     color: '#1a3c5e' },
    { label: 'Pending',  count: a.filter(x => x.status === 'pending').length,  color: '#e67e22' },
    { label: 'Reviewed', count: a.filter(x => x.status === 'reviewed').length, color: '#2980b9' },
    { label: 'Accepted', count: a.filter(x => x.status === 'accepted').length, color: '#27ae60' },
    { label: 'Rejected', count: a.filter(x => x.status === 'rejected').length, color: '#e74c3c' },
  ]
})

const filtered = computed(() => {
  let list = applications.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(a => a.candidate_name.toLowerCase().includes(q) || (a.job?.title ?? '').toLowerCase().includes(q))
  }
  if (statusFilter.value) list = list.filter(a => a.status === statusFilter.value)
  return list
})

const locClass = (loc) => { const l = (loc ?? '').toLowerCase(); if (l === 'remote') return 'loc-remote'; if (l.includes('dar')) return 'loc-dar'; return 'loc-other' }

async function fetchApps() {
  loading.value = true
  try { const { data } = await axios.get(`${API}/applications`); applications.value = data.data ?? data }
  catch {} finally { loading.value = false }
}

async function updateStatus(app, val) {
  try { await axios.patch(`${API}/applications/${app.id}/status`, { status: val }); app.status = val }
  catch { alert('Failed to update.') }
}

async function reEval(app) {
  try {
    const { data } = await axios.post(`${API}/applications/${app.id}/evaluate`)
    Object.assign(app, { resume_score: data.data.resume_score, location_priority: data.data.location_priority, final_score: data.data.final_score, status: data.data.status })
  } catch { alert('Re-evaluation failed.') }
}

onMounted(fetchApps)
</script>

<template>
  <div>
    <h1 class="page-title">Application Reviews</h1>

    <!-- Stats -->
    <div class="stats-row">
      <div v-for="s in summaryStats" :key="s.label" class="mini-stat" :style="`border-color:${s.color}`">
        <span class="s-num" :style="`color:${s.color}`">{{ s.count }}</span>
        <span class="s-lbl">{{ s.label }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input v-model="search" placeholder="Search by name or position…" class="filter-input" />
      <select v-model="statusFilter" class="filter-select">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading applications…</div>

    <div v-else-if="filtered.length">
      <table class="app-table">
        <thead>
          <tr>
            <th>#</th><th>Candidate</th><th>Position</th><th>Location</th>
            <th>Resume</th><th>Priority</th><th>Final</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filtered" :key="app.id">
            <td>{{ app.id }}</td>
            <td>
              <strong>{{ app.candidate_name }}</strong><br>
              <small style="color:#999">{{ app.candidate_email }}</small>
            </td>
            <td>{{ app.job?.title ?? '—' }}</td>
            <td><span class="loc-badge" :class="locClass(app.job?.location)">{{ app.job?.location }}</span></td>
            <td class="center">{{ app.resume_score }}/10</td>
            <td class="center">+{{ app.location_priority }}</td>
            <td class="center final"><strong>{{ app.final_score }}</strong></td>
            <td>
              <select :value="app.status" :class="`status-sel status-${app.status}`" @change="updateStatus(app, $event.target.value)">
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </td>
            <td><button class="btn-re" @click="reEval(app)" title="Re-evaluate">🔄</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="empty">No applications found.</p>
  </div>
</template>


<style scoped>
.page-title  { font-size: 1.8rem; color: #1a3c5e; margin-bottom: 20px; }
.stats-row   { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.mini-stat   { background: #fff; border-left: 4px solid; border-radius: 8px; padding: 12px 20px; min-width: 100px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.s-num       { font-size: 1.6rem; font-weight: 700; display: block; }
.s-lbl       { font-size: 0.8rem; color: #999; }
.filters     { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-input{ flex: 1; min-width: 200px; padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.875rem; }
.filter-select{ padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.875rem; }
.loading, .empty { text-align: center; padding: 40px; color: #999; }
.app-table   { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-size: 0.875rem; }
.app-table th{ background: #1a3c5e; color: #fff; padding: 12px 14px; text-align: left; font-weight: 600; }
.app-table td{ padding: 12px 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
.app-table tr:hover td { background: #fafafa; }
.center      { text-align: center; color: #555; }
.final       { color: #1a3c5e !important; font-size: 1rem; }
.loc-badge   { font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; }
.loc-remote  { background: #e8f5e9; color: #27ae60; }
.loc-dar     { background: #e3f2fd; color: #1565c0; }
.loc-other   { background: #fff3e0; color: #e67e22; }
.status-sel  { padding: 4px 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.8rem; cursor: pointer; }
.status-pending  { border-color: #e67e22; color: #e67e22; }
.status-reviewed { border-color: #2980b9; color: #2980b9; }
.status-accepted { border-color: #27ae60; color: #27ae60; }
.status-rejected { border-color: #e74c3c; color: #e74c3c; }
.btn-re { background: none; border: 1.5px solid #1a3c5e; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 0.85rem; }
.btn-re:hover { background: #eef3f8; }
</style>