import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export interface EntryRequest {
  time: string
  reason: string
  fine: number
}

export interface EntryResponse {
  id: number
  time: string
  reason: string
  fine: number
  createdAt: string
}

export interface MonthlySummary {
  yearMonth: string
  total: number
  count: number
}

export const useEntriesStore = defineStore('entries', () => {
  const entries = ref<EntryResponse[]>([])
  const summaries = ref<MonthlySummary[]>([])
  const loading = ref(false)

  async function fetchEntries(month?: string) {
    loading.value = true
    try {
      const params = month ? { month } : {}
      const { data } = await api.get<EntryResponse[]>('/api/entries', { params })
      entries.value = data
    } finally {
      loading.value = false
    }
  }

  async function createEntry(entry: EntryRequest) {
    const { data } = await api.post<EntryResponse>('/api/entries', entry)
    entries.value.unshift(data)
    return data
  }

  async function updateEntry(id: number, entry: EntryRequest) {
    const { data } = await api.put<EntryResponse>('/api/entries/' + id, entry)
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) entries.value[idx] = data
    return data
  }

  async function deleteEntry(id: number) {
    await api.delete('/api/entries/' + id)
    entries.value = entries.value.filter(e => e.id !== id)
  }

  async function fetchSummary(year?: number) {
    try {
      const params = year ? { year } : {}
      const { data } = await api.get<MonthlySummary[]>('/api/entries/summary', { params })
      summaries.value = data
    } catch {
      // Prevent unhandled rejection
    }
  }

  return { entries, summaries, loading, fetchEntries, createEntry, updateEntry, deleteEntry, fetchSummary }
})
