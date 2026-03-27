import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('displayName')
      localStorage.removeItem('role')
      localStorage.removeItem('mustChangePassword')
      localStorage.removeItem('apps')
      // Detect if running inside a host shell (e.g., /toolbox-shell/swear-jar)
      // and redirect to the host's login page accordingly
      const path = window.location.pathname
      const idx = path.indexOf('/swear-jar')
      if (idx > 0) {
        window.location.href = path.substring(0, idx) + '/login'
      } else {
        window.location.href = (import.meta.env.BASE_URL || '/') + 'login'
      }
    }
    return Promise.reject(error)
  }
)

export default api