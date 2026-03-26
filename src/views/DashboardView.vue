<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useEntriesStore } from '@/stores/entries'
import type { EntryResponse, EntryRequest } from '@/stores/entries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, ListChecks, BarChart3 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import EntryFormDialog from '@/components/EntryFormDialog.vue'

const store = useEntriesStore()
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const showForm = ref(false)
const editingEntry = ref<EntryResponse | null>(null)
const showDeleteDialog = ref(false)
const deleteId = ref<number | null>(null)

function openCreate() {
  editingEntry.value = null
  showForm.value = true
}

function openEdit(entry: EntryResponse) {
  editingEntry.value = entry
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingEntry.value = null
}

async function handleSave(data: EntryRequest) {
  try {
    if (editingEntry.value) {
      await store.updateEntry(editingEntry.value.id, data)
      toast.success('紀錄已更新')
    } else {
      await store.createEntry(data)
      toast.success('紀錄已新增')
    }
    closeForm()
    store.fetchSummary()
  } catch (e: any) {
    toast.error(e.response?.data?.message || '操作失敗')
  }
}

function openDelete(id: number) {
  deleteId.value = id
  showDeleteDialog.value = true
}

async function confirmDelete() {
  const id = deleteId.value
  if (id === null) return
  try {
    await store.deleteEntry(id)
    toast.success('紀錄已刪除')
    store.fetchSummary()
  } catch (e: any) {
    toast.error(e.response?.data?.message || '刪除失敗')
  } finally {
    showDeleteDialog.value = false
    deleteId.value = null
  }
}

function fmtTime(t: string) {
  return new Date(t).toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-')
  return `${y} 年 ${parseInt(m)} 月`
}

function fineLevel(fine: number) {
  if (fine >= 300) return 'destructive'
  if (fine >= 200) return 'default'
  return 'secondary'
}

watch(selectedMonth, (m) => store.fetchEntries(m), { immediate: false })

onMounted(() => {
  store.fetchEntries(selectedMonth.value)
  store.fetchSummary()
})
</script>

<template>
  <div class="space-y-6">
    <Tabs default-value="entries">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <TabsList>
          <TabsTrigger value="entries">
            <ListChecks class="mr-1.5 h-4 w-4" />
            紀錄
          </TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart3 class="mr-1.5 h-4 w-4" />
            統計
          </TabsTrigger>
        </TabsList>
        <div class="flex items-center gap-3">
          <input
            type="month"
            v-model="selectedMonth"
            class="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button size="sm" @click="openCreate">
            <Plus class="mr-1.5 h-4 w-4" />
            新增紀錄
          </Button>
        </div>
      </div>

      <!-- Entries Tab -->
      <TabsContent value="entries" class="mt-4">
        <!-- Loading -->
        <div v-if="store.loading" class="space-y-3">
          <Skeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-lg" />
        </div>

        <!-- Empty state -->
        <Card v-else-if="!store.entries.length" class="py-12">
          <CardContent class="text-center text-muted-foreground">
            <div class="text-4xl mb-3">📝</div>
            <p class="text-lg font-medium">這個月還沒有紀錄</p>
            <p class="text-sm mt-1">點擊「新增紀錄」開始記錄</p>
          </CardContent>
        </Card>

        <!-- Entry list -->
        <div v-else class="space-y-2">
          <Card
            v-for="e in store.entries"
            :key="e.id"
            class="transition-shadow hover:shadow-md"
          >
            <CardContent class="flex items-center justify-between py-3 px-4">
              <div class="flex flex-col gap-0.5 min-w-0 flex-1">
                <span class="text-xs text-muted-foreground">{{ fmtTime(e.time) }}</span>
                <span class="text-sm truncate">{{ e.reason }}</span>
              </div>
              <div class="flex items-center gap-3 ml-4 shrink-0">
                <Badge :variant="fineLevel(e.fine)" class="text-sm font-semibold">
                  ${{ e.fine }}
                </Badge>
                <div class="flex gap-1">
                  <Button variant="ghost" size="icon" class="h-8 w-8" @click="openEdit(e)">
                    <Pencil class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-destructive hover:text-destructive"
                    @click="openDelete(e.id)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Rules Card -->
        <Card class="mt-6">
          <CardHeader class="pb-3">
            <CardTitle class="text-base">📋 罰款規則</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span>一般髒話</span>
              <Badge variant="secondary">$100</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span>情緒性連續髒話</span>
              <Badge>$200</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span>攻擊他人 / 公開失言</span>
              <Badge variant="destructive">$300</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Summary Tab -->
      <TabsContent value="summary" class="mt-4">
        <Card v-if="!store.summaries.length" class="py-12">
          <CardContent class="text-center text-muted-foreground">
            <div class="text-4xl mb-3">📊</div>
            <p class="text-lg font-medium">尚無統計資料</p>
          </CardContent>
        </Card>

        <Card v-else>
          <CardHeader class="pb-3">
            <CardTitle class="text-base">月份合計</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>月份</TableHead>
                  <TableHead class="text-center">次數</TableHead>
                  <TableHead class="text-right">合計</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="s in store.summaries" :key="s.yearMonth">
                  <TableCell>{{ fmtMonth(s.yearMonth) }}</TableCell>
                  <TableCell class="text-center">{{ s.count }}</TableCell>
                  <TableCell class="text-right font-semibold text-primary">${{ s.total }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Entry Form Dialog -->
    <EntryFormDialog
      v-model:open="showForm"
      :entry="editingEntry"
      @save="handleSave"
    />

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="showDeleteDialog" @update:open="(v: boolean) => { if (!v) { showDeleteDialog = false } }">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要刪除這筆紀錄嗎？</AlertDialogTitle>
          <AlertDialogDescription>此操作無法復原</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete" class="bg-destructive text-white hover:bg-destructive/90">
            刪除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
