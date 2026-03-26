<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'vue-sonner'
import { useAdminStore } from '@/stores/admin'
import { UserPlus, Shield, User } from 'lucide-vue-next'

const admin = useAdminStore()
const showRegister = ref(false)
const loading = ref(false)

// Register form
const regForm = ref({ username: '', displayName: '', password: '', email: '', role: 'User' })

function resetRegForm() {
  regForm.value = { username: '', displayName: '', password: '', email: '', role: 'User' }
}

async function handleRegister() {
  const { username, displayName, password } = regForm.value
  if (!username || !displayName || !password) {
    toast.error('請填寫所有必填欄位')
    return
  }
  if (password.length < 6) {
    toast.error('密碼長度至少 6 個字元')
    return
  }

  loading.value = true
  try {
    await admin.registerUser(regForm.value)
    toast.success('使用者已建立')
    showRegister.value = false
    resetRegForm()
  } catch (e: any) {
    toast.error(e.response?.data?.message || e.response?.data || '建立失敗')
  } finally {
    loading.value = false
  }
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  admin.fetchUsers()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">使用者管理</h2>
        <p class="text-sm text-muted-foreground">管理系統使用者帳號</p>
      </div>
      <Button size="sm" @click="showRegister = true">
        <UserPlus class="mr-1.5 h-4 w-4" />
        新增使用者
      </Button>
    </div>

    <!-- Users Table -->
    <Card>
      <CardContent class="p-0">
        <div v-if="admin.loading" class="p-6 space-y-3">
          <Skeleton v-for="i in 4" :key="i" class="h-12 w-full" />
        </div>
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>帳號</TableHead>
              <TableHead>名稱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>最後登入</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="u in admin.users" :key="u.id">
              <TableCell class="font-medium">{{ u.username }}</TableCell>
              <TableCell>{{ u.displayName }}</TableCell>
              <TableCell>
                <Badge :variant="u.role === 'Admin' ? 'default' : 'secondary'" class="gap-1">
                  <Shield v-if="u.role === 'Admin'" class="h-3 w-3" />
                  <User v-else class="h-3 w-3" />
                  {{ u.role === 'Admin' ? '管理員' : '使用者' }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="u.isActive ? 'secondary' : 'destructive'">
                  {{ u.isActive ? '啟用' : '停用' }}
                </Badge>
              </TableCell>
              <TableCell class="text-muted-foreground text-sm">
                {{ fmtDate(u.lastLoginAt) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Register User Dialog -->
    <Dialog v-model:open="showRegister" @update:open="(v) => { if (!v) resetRegForm() }">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增使用者</DialogTitle>
          <DialogDescription>建立新的系統帳號，使用者首次登入需修改密碼</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="reg-username">帳號 *</Label>
            <Input id="reg-username" v-model="regForm.username" placeholder="英文帳號" :disabled="loading" />
          </div>
          <div class="space-y-2">
            <Label for="reg-display">顯示名稱 *</Label>
            <Input id="reg-display" v-model="regForm.displayName" placeholder="顯示於介面的名稱" :disabled="loading" />
          </div>
          <div class="space-y-2">
            <Label for="reg-email">Email</Label>
            <Input id="reg-email" v-model="regForm.email" type="email" placeholder="選填" :disabled="loading" />
          </div>
          <div class="space-y-2">
            <Label for="reg-password">初始密碼 *</Label>
            <Input id="reg-password" v-model="regForm.password" type="password" placeholder="至少 6 個字元" :disabled="loading" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showRegister = false" :disabled="loading">取消</Button>
            <Button type="submit" :disabled="loading">{{ loading ? '建立中...' : '建立' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
