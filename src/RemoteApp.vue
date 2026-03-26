<script setup lang="ts">
import '@/assets/index.css'
import { getCurrentInstance, onErrorCaptured, ref } from 'vue'
import { getActivePinia, setActivePinia, createPinia } from 'pinia'
import DashboardView from '@/views/DashboardView.vue'
import { Toaster } from '@/components/ui/sonner'

// When loaded as a Module Federation remote, Pinia may not be active yet due to
// shared module initialization order. Set it from the host app's injection context.
if (!getActivePinia()) {
  const instance = getCurrentInstance()
  const pinia = instance?.appContext.config.globalProperties.$pinia
  if (pinia) {
    setActivePinia(pinia)
  } else {
    // Fallback: create and install Pinia when the host hasn't finished setup yet
    const fallback = createPinia()
    const app = instance?.appContext.app
    if (app) app.use(fallback)
    setActivePinia(fallback)
  }
}

const renderError = ref(false)
onErrorCaptured(() => {
  renderError.value = true
  return false
})
</script>

<template>
  <Toaster position="top-right" :duration="3000" rich-colors />
  <div v-if="renderError" style="text-align:center; padding:2rem; color:var(--color-muted);">
    <p>應用程式發生錯誤，請重新整理頁面</p>
  </div>
  <DashboardView v-else />
</template>