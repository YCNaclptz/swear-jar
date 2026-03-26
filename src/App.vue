<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { Toaster } from '@/components/ui/sonner'

const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')
</script>

<template>
  <Toaster position="top-right" :duration="3000" rich-colors />
  <MainLayout v-if="!isLoginPage">
    <RouterView />
  </MainLayout>
  <RouterView v-else />
</template>
