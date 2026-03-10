import { defineStore } from 'pinia'
import DataService from '@/services/endpoints'

export const useStore = defineStore('main', {
  state: () => ({
    // ── Auth ──
    user:  JSON.parse(sessionStorage.getItem('psrs_user') ?? 'null'),
    token: sessionStorage.getItem('psrs_token') ?? null,

    // ── Jobs ──
    jobs:       [],
    job:        null,

    // ── Applications ──
    applications: [],
    application:  null,

    // ── UI ──
    loading: false,
    error:   null,
  }),

  getters: {
    // Auth
    isLoggedIn: (s) => !!s.token,
    isAdmin:    (s) => s.user?.role === 'admin',
    isEditor:   (s) => ['admin', 'editor'].includes(s.user?.role),

    // Applications summary counts
    totalApplications:    (s) => s.applications.length,
    pendingApplications:  (s) => s.applications.filter(a => a.status === 'pending').length,
    reviewedApplications: (s) => s.applications.filter(a => a.status === 'reviewed').length,
    acceptedApplications: (s) => s.applications.filter(a => a.status === 'accepted').length,
    rejectedApplications: (s) => s.applications.filter(a => a.status === 'rejected').length,
  },

  actions: {

    // ════════════════════════════════════════
    //  AUTH
    // ════════════════════════════════════════

    _persist() {
      sessionStorage.setItem('psrs_token', this.token)
      sessionStorage.setItem('psrs_user',  JSON.stringify(this.user))
    },

    _clear() {
      this.token = null
      this.user  = null
      sessionStorage.removeItem('psrs_token')
      sessionStorage.removeItem('psrs_user')
    },

    async register(payload) {
      const { data } = await DataService.register(payload)
      this.token = data.token
      this.user  = data.user
      this._persist()
      return data
    },

    async login(payload) {
      const { data } = await DataService.login(payload)
      this.token = data.token
      this.user  = data.user
      this._persist()
      return data
    },

    async logout() {
      try { await DataService.logout() } catch {}
      this._clear()
    },

    async forgotPassword(email) {
      const { data } = await DataService.forgotPassword({ email })
      return data
    },

    async resetPassword(payload) {
      const { data } = await DataService.resetPassword(payload)
      return data
    },

    async fetchMe() {
      const { data } = await DataService.me()
      this.user = data.user
      sessionStorage.setItem('psrs_user', JSON.stringify(this.user))
      return data
    },

    async generateApiKey() {
      const { data } = await DataService.generateApiKey()
      return data
    },

    // ════════════════════════════════════════
    //  JOBS
    // ════════════════════════════════════════

    async fetchJobs() {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.getAllJobs()
        this.jobs = data.data ?? data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to load jobs.'
      } finally {
        this.loading = false
      }
    },

    async fetchJobsAdmin() {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.getAllJobsAdmin()
        this.jobs = data.data ?? data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to load jobs.'
      } finally {
        this.loading = false
      }
    },

    async fetchJob(id) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.getJob({ id })
        this.job = data.data ?? data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to load job.'
      } finally {
        this.loading = false
      }
    },

    async createJob(payload) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.createJob(payload)
        this.jobs.unshift(data.data)
        return data
      } catch (e) {
        this.error = e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : (e.response?.data?.message ?? 'Failed to create job.')
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateJob(id, payload) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.updateJob({ id, ...payload })
        const index = this.jobs.findIndex(j => j.id === id)
        if (index !== -1) this.jobs[index] = data.data
        return data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to update job.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteJob(id) {
      this.loading = true
      this.error   = null
      try {
        await DataService.deleteJob({ id })
        this.jobs = this.jobs.filter(j => j.id !== id)
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to delete job.'
        throw e
      } finally {
        this.loading = false
      }
    },

    // ════════════════════════════════════════
    //  APPLICATIONS
    // ════════════════════════════════════════

    async fetchApplications() {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.getAllApplications()
        this.applications = data.data ?? data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to load applications.'
      } finally {
        this.loading = false
      }
    },

    async fetchApplication(id) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.getApplication({ id })
        this.application = data.data ?? data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to load application.'
      } finally {
        this.loading = false
      }
    },

    async applyJob(payload) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.applyJob(payload)
        return data
      } catch (e) {
        this.error = e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : (e.response?.data?.message ?? 'Failed to submit application.')
        throw e
      } finally {
        this.loading = false
      }
    },

    async evaluateApplication(id) {
      this.loading = true
      this.error   = null
      try {
        const { data } = await DataService.evaluateApplication({ id })
        const index = this.applications.findIndex(a => a.id === id)
        if (index !== -1) Object.assign(this.applications[index], data.data)
        return data
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Re-evaluation failed.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateApplicationStatus(id, status) {
      this.error = null
      try {
        await DataService.updateApplicationStatus({ id, status })
        const index = this.applications.findIndex(a => a.id === id)
        if (index !== -1) this.applications[index].status = status
      } catch (e) {
        this.error = e.response?.data?.message ?? 'Failed to update status.'
        throw e
      }
    },

  },
})