
import axios from 'axios'
import router from '@/router'

const http = axios.create({
  baseURL:  'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


http.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('psrs_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('psrs_token')
      sessionStorage.removeItem('psrs_user')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default http