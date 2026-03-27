<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Moon, Sun, Shield, LayoutDashboard, KeyRound } from 'lucide-vue-next'
import JarIcon from '@/components/icons/JarIcon.vue'
import ChangePasswordDialog from '@/components/ChangePasswordDialog.vue'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { isDark, toggle } = useDarkMode()
const showChangePassword = ref(false)

const initials = computed(() => {
  const name = auth.displayName || '?'
  return name.slice(0, 2)
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Top navigation bar -->
    <header class="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div class="flex items-center gap-4">
          <h1 class="flex items-center gap-1.5 text-lg font-bold text-primary"><JarIcon class="h-5 w-5" />髒話罐</h1>
          <Separator orientation="vertical" class="h-6" />
          <nav class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              :class="{ 'bg-accent': route.name === 'dashboard' }"
              @click="router.push('/')"
            >
              <LayoutDashboard class="mr-1.5 h-4 w-4" />
              紀錄管理
            </Button>
            <Button
              v-if="auth.isAdmin"
              variant="ghost"
              size="sm"
              :class="{ 'bg-accent': route.name === 'admin' }"
              @click="router.push('/admin')"
            >
              <Shield class="mr-1.5 h-4 w-4" />
              使用者管理
            </Button>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <!-- Dark mode toggle -->
          <Button variant="ghost" size="icon" @click="toggle" class="h-8 w-8">
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </Button>

          <!-- User menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8">
                  <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                    {{ initials }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48" align="end">
              <DropdownMenuLabel>
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium">{{ auth.displayName }}</p>
                  <p class="text-xs text-muted-foreground">{{ '' }}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="showChangePassword = true">
                <KeyRound class="mr-2 h-4 w-4" />
                修改密碼
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="text-destructive">
                <LogOut class="mr-2 h-4 w-4" />
                登出
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="mx-auto max-w-5xl px-4 py-6">
      <slot />
    </main>

    <ChangePasswordDialog v-model:open="showChangePassword" />
  </div>
</template>
