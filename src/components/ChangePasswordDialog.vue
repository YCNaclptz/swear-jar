<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'vue-sonner'

const open = defineModel<boolean>('open', { default: false })

const auth = useAuthStore()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

function reset() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
}

async function handleSubmit() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = '請填寫所有欄位'
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
    await auth.changePassword(currentPassword.value, newPassword.value)
    toast.success('密碼修改成功')
    open.value = false
    reset()
  } catch (e: any) {
    error.value = e.response?.data?.message || e.response?.data || '密碼修改失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="(v) => { if (!v) reset() }">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>修改密碼</DialogTitle>
        <DialogDescription>請輸入目前密碼及新密碼</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="cur-pwd">目前密碼</Label>
          <Input id="cur-pwd" v-model="currentPassword" type="password" :disabled="loading" />
        </div>
        <div class="space-y-2">
          <Label for="new-pwd">新密碼</Label>
          <Input id="new-pwd" v-model="newPassword" type="password" placeholder="至少 6 個字元" :disabled="loading" />
        </div>
        <div class="space-y-2">
          <Label for="cfm-pwd">確認密碼</Label>
          <Input id="cfm-pwd" v-model="confirmPassword" type="password" :disabled="loading" />
        </div>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false" :disabled="loading">取消</Button>
          <Button type="submit" :disabled="loading">{{ loading ? '儲存中...' : '儲存' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
