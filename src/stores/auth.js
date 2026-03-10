import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:80001/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:  JSON.parse(sessionStorage.getItem('psrs_user') ?? 'null'),
    token: sessionStorage.getItem('psrs_token') ?? null,
  }),

  getters: {
    isLoggedIn: (s) => !!s.token,
    isAdmin:    (s) => s.user?.role === 'admin',
    isEditor:   (s) => ['admin', 'editor'].includes(s.user?.role),
  },

  actions: {
    _persist() {
      sessionStorage.setItem('psrs_token', this.token ?? '')
      sessionStorage.setItem('psrs_user',  JSON.stringify(this.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },

    async register(payload) {
      const { data } = await axios.post(`${API}/auth/register`, payload)
      this.token = data.token
      this.user  = data.user
      this._persist()
      return data
    },

    async login(payload) {
      const { data } = await axios.post(`${API}/auth/login`, payload)
      this.token = data.token
      this.user  = data.user
      this._persist()
      return data
    },

    async logout() {
      try { await axios.post(`${API}/auth/logout`) } catch {}
      this.token = null
      this.user  = null
      sessionStorage.removeItem('psrs_token')
      sessionStorage.removeItem('psrs_user')
      delete axios.defaults.headers.common['Authorization']
    },

    async forgotPassword(email) {
      const { data } = await axios.post(`${API}/auth/forgot-password`, { email })
      return data
    },

    init() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },
  },
})