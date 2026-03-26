import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

interface LoginResponse {
  token: string
  refreshToken: string
  displayName: string
  role: string
  mustChangePassword: boolean
  apps: { id: string; name: string; icon: string; routePrefix: string }[]
}

export const useAuthStore = defineStore('swear-jar-auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const displayName = ref(localStorage.getItem('displayName') || '')
  const role = ref(localStorage.getItem('role') || '')
  const mustChangePassword = ref(localStorage.getItem('mustChangePassword') === 'true')

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'Admin')

  async function login(username: string, password: string): Promise<{ mustChangePassword: boolean }> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', { username, password })
    token.value = data.token
    refreshToken.value = data.refreshToken
    displayName.value = data.displayName
    role.value = data.role
    mustChangePassword.value = data.mustChangePassword

    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('displayName', data.displayName)
    localStorage.setItem('role', data.role)
    localStorage.setItem('mustChangePassword', String(data.mustChangePassword))

    return { mustChangePassword: data.mustChangePassword }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.post<{ token: string }>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    })
    token.value = data.token
    localStorage.setItem('token', data.token)
    mustChangePassword.value = false
    localStorage.setItem('mustChangePassword', 'false')
  }

  async function doRefreshToken() {
    try {
      const { data } = await api.post<{ token: string; refreshToken: string }>('/api/auth/refresh', {
        refreshToken: refreshToken.value,
      })
      token.value = data.token
      refreshToken.value = data.refreshToken
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    refreshToken.value = ''
    displayName.value = ''
    role.value = ''
    mustChangePassword.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('displayName')
    localStorage.removeItem('role')
    localStorage.removeItem('mustChangePassword')
  }

  return {
    token,
    refreshToken,
    displayName,
    role,
    mustChangePassword,
    isAuthenticated,
    isAdmin,
    login,
    changePassword,
    doRefreshToken,
    logout,
  }
})