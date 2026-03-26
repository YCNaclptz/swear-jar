<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Change password state
const showChangePassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '請輸入帳號和密碼'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await auth.login(username.value, password.value)
    if (result.mustChangePassword) {
      showChangePassword.value = true
      toast.info('首次登入，請修改密碼')
    } else {
      toast.success('登入成功')
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || e.response?.data || '登入失敗，請檢查帳號密碼'
  } finally {
    loading.value = false
  }
}

async function handleChangePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    error.value = '請輸入新密碼'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = '兩次密碼不一致'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = '密碼長度至少 6 個字元'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await auth.changePassword(password.value, newPassword.value)
    toast.success('密碼修改成功')
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.response?.data || '密碼修改失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm">
      <!-- Logo / Title -->
      <div class="mb-8 text-center">
        <div class="text-4xl mb-2">🫙</div>
        <h1 class="text-2xl font-bold text-primary">髒話罐</h1>
        <p class="mt-1 text-sm text-muted-foreground">髒話罰款紀錄系統</p>
      </div>

      <!-- Login Form -->
      <Card v-if="!showChangePassword">
        <CardHeader>
          <CardTitle>登入</CardTitle>
          <CardDescription>請輸入您的帳號和密碼</CardDescription>
        </CardHeader>
        <form @submit.prevent="handleLogin">
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="username">帳號</Label>
              <Input
                id="username"
                v-model="username"
                placeholder="請輸入帳號"
                :disabled="loading"
                autofocus
              />
            </div>
            <div class="space-y-2">
              <Label for="password">密碼</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="請輸入密碼"
                :disabled="loading"
              />
            </div>
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          </CardContent>
          <CardFooter>
            <Button type="submit" class="w-full" :disabled="loading">
              {{ loading ? '登入中...' : '登入' }}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <!-- Force Change Password Form -->
      <Card v-else>
        <CardHeader>
          <CardTitle>修改密碼</CardTitle>
          <CardDescription>首次登入請設定新密碼</CardDescription>
        </CardHeader>
        <form @submit.prevent="handleChangePassword">
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="new-password">新密碼</Label>
              <Input
                id="new-password"
                v-model="newPassword"
                type="password"
                placeholder="至少 6 個字元"
                :disabled="loading"
                autofocus
              />
            </div>
            <div class="space-y-2">
              <Label for="confirm-password">確認密碼</Label>
              <Input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                placeholder="再輸入一次新密碼"
                :disabled="loading"
              />
            </div>
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
          </CardContent>
          <CardFooter>
            <Button type="submit" class="w-full" :disabled="loading">
              {{ loading ? '儲存中...' : '設定新密碼' }}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </div>
</template>
