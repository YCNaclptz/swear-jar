import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export interface UserListItem {
  id: number
  username: string
  displayName: string
  email: string | null
  role: string
  isActive: boolean
  mustChangePassword: boolean
  lastLoginAt: string | null
}

export interface AppInfo {
  id: string
  name: string
  description: string | null
  icon: string | null
  isActive: boolean
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<UserListItem[]>([])
  const apps = ref<AppInfo[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      const { data } = await api.get<UserListItem[]>('/api/auth/users')
      users.value = data
    } finally {
      loading.value = false
    }
  }

  async function registerUser(payload: {
    username: string
    displayName: string
    password: string
    email?: string
    role?: string
  }) {
    const { data } = await api.post<UserListItem>('/api/auth/register', payload)
    users.value.push(data)
    return data
  }

  async function fetchApps() {
    const { data } = await api.get<AppInfo[]>('/api/auth/apps')
    apps.value = data
  }

  async function grantAccess(userId: number, appId: string) {
    await api.post('/api/auth/access', { userId, applicationId: appId })
  }

  async function revokeAccess(userId: number, appId: string) {
    await api.delete(`/api/auth/access/${userId}/${appId}`)
  }

  return { users, apps, loading, fetchUsers, registerUser, fetchApps, grantAccess, revokeAccess }
})
