<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores'

const route  = useRoute()
const store  = useStore()
const result = ref(null)
const error  = ref('')
const form   = ref({ candidate_name: '', candidate_email: '', resume_summary: '' })

const locClass     = (loc) => { const l = (loc ?? '').toLowerCase(); if (l === 'remote') return 'loc-remote'; if (l.includes('dar')) return 'loc-dar'; return 'loc-other' }
const formatSalary = (v) => Number(v).toLocaleString()

async function submit() {
  error.value = ''
  try {
    const data = await store.applyJob({ ...form.value, job_id: route.params.id })
    result.value = data.data
  } catch (e) {
    const errs = e.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' ') : (e.response?.data?.message ?? 'Submission failed.')
  }
}

onMounted(() => store.fetchJob(route.params.id))
</script>

<template>
  <div class="apply-page">
    <RouterLink to="/jobs" class="back">← Back to Jobs</RouterLink>

    <div v-if="store.loading" class="loading">Loading job…</div>

    <div v-else-if="store.job">
      <!-- Job header -->
      <div class="job-header">
        <span class="dept">{{ store.job.department }}</span>
        <h1>{{ store.job.title }}</h1>
        <div class="meta">
          <span class="loc-badge" :class="locClass(store.job.location)">📍 {{ store.job.location }}</span>
          <span class="salary-tag">💰 Tsh {{ formatSalary(store.job.salary) }}</span>
        </div>
      </div>

      <!-- Result card after submission -->
      <div v-if="result" class="result-card">
        <h2>✅ Application Submitted!</h2>
        <table class="result-table">
          <tr><th>Candidate Name</th>      <td>{{ result.candidate_name }}</td></tr>
          <tr><th>Position Applied For</th><td>{{ result.position }}</td></tr>
          <tr><th>Resume Score</th>        <td>{{ result.resume_score }} / 10</td></tr>
          <tr><th>Location Priority</th>   <td>+{{ result.location_priority }} pts</td></tr>
          <tr class="final"><th>Final Score</th><td><strong>{{ result.final_score }}</strong></td></tr>
        </table>
        <RouterLink to="/jobs" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Browse More Jobs</RouterLink>
      </div>

      <!-- Application form -->
      <div v-else class="form-card">
        <h2>Submit Your Application</h2>
        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <div class="form-row">
          <div class="form-group">
            <label>Full Name *</label>
            <input v-model="form.candidate_name" placeholder="Jina lako kamili" />
          </div>
          <div class="form-group">
            <label>Email Address *</label>
            <input v-model="form.candidate_email" type="email" placeholder="email@example.com" />
          </div>
        </div>

        <div class="form-group">
          <label>Resume / Profile Summary * <small>(min 20 characters)</small></label>
          <textarea v-model="form.resume_summary" rows="6" placeholder="Describe your skills and experience…"></textarea>
          <small>{{ form.resume_summary.length }} chars</small>
        </div>

        <button class="btn btn-primary btn-lg" :disabled="store.loading" @click="submit">
          {{ store.loading ? 'Submitting…' : 'Submit Application' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-page { max-width: 760px; margin: 0 auto; }
.back  { color: #1a3c5e; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: inline-block; margin-bottom: 20px; }
.loading { text-align: center; padding: 40px; color: #666; }
.job-header { background: #1a3c5e; color: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
.dept { font-size: 0.75rem; text-transform: uppercase; opacity: 0.7; font-weight: 600; }
.job-header h1 { font-size: 1.5rem; margin: 6px 0 10px; }
.meta  { display: flex; gap: 12px; flex-wrap: wrap; }
.loc-badge { font-size: 0.85rem; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
.loc-remote { background: #c8f7c5; color: #1e8449; }
.loc-dar    { background: #d6eaf8; color: #1a5276; }
.loc-other  { background: #fdebd0; color: #784212; }
.salary-tag { background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
.form-card, .result-card { background: #fff; border-radius: 12px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.form-card h2, .result-card h2 { color: #1a3c5e; margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #444; margin-bottom: 5px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; font-family: inherit; }
.form-group small { color: #bbb; font-size: 0.8rem; }
.btn { padding: 10px 22px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; }
.btn-primary { background: #1a3c5e; color: #fff; }
.btn-primary:hover { background: #2980b9; }
.btn-lg { padding: 13px 30px; font-size: 1rem; }
.alert { padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 0.875rem; }
.alert-error { background: #fdecea; color: #c0392b; }
.result-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
.result-table th, .result-table td { padding: 10px 14px; border: 1px solid #eee; text-align: left; }
.result-table th { background: #f4f6f9; color: #555; font-weight: 600; width: 40%; }
.result-table .final th, .result-table .final td { background: #e8f5e9; color: #1e8449; font-size: 1.05rem; }
@media(max-width: 540px) { .form-row { grid-template-columns: 1fr; } }
</style>