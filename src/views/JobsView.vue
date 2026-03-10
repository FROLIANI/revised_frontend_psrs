<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const jobs = ref([])
const loading = ref(true)
const search = ref('')
const locFilter = ref('')
const showModal = ref(false)
const saving = ref(false)
const formErr = ref('')
const newJob = ref({ title: '', department: '', location: '', salary: '', description: '' })

const filteredJobs = computed(() => {
  let list = jobs.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (j) => j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q)
    )
  }
  if (locFilter.value === 'remote') list = list.filter((j) => j.location.toLowerCase() === 'remote')
  if (locFilter.value === 'dar') list = list.filter((j) => j.location.toLowerCase().includes('dar'))
  if (locFilter.value === 'other')
    list = list.filter(
      (j) =>
        !['remote'].includes(j.location.toLowerCase()) && !j.location.toLowerCase().includes('dar')
    )
  return list
})

const locClass = (loc) => {
  const l = loc.toLowerCase()
  if (l === 'remote') return 'loc-remote'
  if (l.includes('dar')) return 'loc-dar'
  return 'loc-other'
}
const formatSalary = (v) => Number(v).toLocaleString()

async function fetchJobs() {
  loading.value = true
  try {
    const { data } = await axios.get(`${API}/jobs`)
    jobs.value = data.data ?? data
  } catch {
  } finally {
    loading.value = false
  }
}

async function addJob() {
  formErr.value = ''
  saving.value = true
  try {
    await axios.post(`${API}/jobs`, newJob.value)
    showModal.value = false
    newJob.value = { title: '', department: '', location: '', salary: '', description: '' }
    await fetchJobs()
  } catch (e) {
    const errs = e.response?.data?.errors
    formErr.value = errs ? Object.values(errs).flat().join(' ') : 'Failed to add job.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Job Listings</h1>
      <button v-if="auth.isEditor" class="btn btn-primary" @click="showModal = true">
        + Add Job
      </button>
    </div>

    <div class="filters">
      <input v-model="search" placeholder="Search jobs…" class="filter-input" />
      <select v-model="locFilter" class="filter-select">
        <option value="">All Locations</option>
        <option value="remote">Remote</option>
        <option value="dar">Dar Es Salaam</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading job listings…</div>

    <div v-else class="jobs-grid">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <div class="job-card-top">
          <span class="dept">{{ job.department }}</span>
          <span class="loc-badge" :class="locClass(job.location)">{{ job.location }}</span>
        </div>
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="salary">Tsh {{ formatSalary(job.salary) }}</p>
        <p class="meta">{{ job.applications_count ?? 0 }} applicants</p>
        <div class="card-actions">
          <RouterLink :to="`/jobs/${job.id}`" class="btn btn-outline">Details</RouterLink>
          <RouterLink :to="`/apply/${job.id}`" class="btn btn-primary">Apply Now</RouterLink>
        </div>
      </div>
    </div>

    <p v-if="!loading && filteredJobs.length === 0" class="empty">No jobs found.</p>

    <!-- Add Job Modal -->
    <div v-if="showModal" class="overlay" @click.self="showModal = false">
      <div class="modal">
        <h2>Add New Job</h2>
        <div v-if="formErr" class="alert alert-error">{{ formErr }}</div>

        <div class="form-group"><label>Title *</label><input v-model="newJob.title" /></div>
        <div class="form-group">
          <label>Department *</label><input v-model="newJob.department" />
        </div>
        <div class="form-group">
          <label>Location *</label
          ><input v-model="newJob.location" placeholder="Remote / Dar Es Salaam / Other" />
        </div>
        <div class="form-group">
          <label>Salary (Tsh) *</label><input v-model="newJob.salary" type="number" />
        </div>
        <div class="form-group">
          <label>Description</label><textarea v-model="newJob.description" rows="3"></textarea>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="showModal = false">Cancel</button>
          <button class="btn btn-primary" :disabled="saving" @click="addJob">
            {{ saving ? 'Saving…' : 'Save Job' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  font-size: 1.8rem;
  color: #1a3c5e;
}
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.filter-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}
.filter-select {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.job-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}
.job-card:hover {
  transform: translateY(-3px);
}
.job-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.dept {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
}
.loc-badge {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
}
.loc-remote {
  background: #e8f5e9;
  color: #27ae60;
}
.loc-dar {
  background: #e3f2fd;
  color: #1565c0;
}
.loc-other {
  background: #fff3e0;
  color: #e67e22;
}
.job-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a3c5e;
  margin-bottom: 4px;
}
.salary {
  color: #27ae60;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}
.meta {
  font-size: 0.8rem;
  color: #bbb;
  margin-bottom: 14px;
}
.card-actions {
  display: flex;
  gap: 8px;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 40px;
}
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  display: inline-flex;
  align-items: center;
}
.btn-primary {
  background: #1a3c5e;
  color: #fff;
}
.btn-primary:hover {
  background: #2980b9;
}
.btn-outline {
  background: transparent;
  color: #1a3c5e;
  border: 1.5px solid #1a3c5e;
}
.btn-outline:hover {
  background: #eef3f8;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  width: 500px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
}
.modal h2 {
  margin-bottom: 20px;
  color: #1a3c5e;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.form-group {
  margin-bottom: 14px;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 5px;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
}
.alert {
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 0.875rem;
}
.alert-error {
  background: #fdecea;
  color: #c0392b;
}
</style>