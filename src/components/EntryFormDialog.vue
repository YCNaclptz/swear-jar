<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { EntryResponse, EntryRequest } from '@/stores/entries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{ entry: EntryResponse | null }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ save: [data: EntryRequest] }>()

const time = ref('')
const reason = ref('')
const fine = ref(100)
const customFine = ref(false)
const presets = [
  { label: '$100', value: 100 },
  { label: '$200', value: 200 },
  { label: '$300', value: 300 },
]

function initForm() {
  if (props.entry) {
    time.value = new Date(new Date(props.entry.time).getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    reason.value = props.entry.reason
    fine.value = props.entry.fine
    customFine.value = ![100, 200, 300].includes(props.entry.fine)
  } else {
    time.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    reason.value = ''
    fine.value = 100
    customFine.value = false
  }
}

watch(open, (v) => {
  if (v) initForm()
})

function selectFine(v: number) {
  fine.value = v
  customFine.value = false
}

function handleSubmit() {
  emit('save', {
    time: new Date(time.value).toISOString(),
    reason: reason.value,
    fine: fine.value,
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ entry ? '編輯紀錄' : '新增紀錄' }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="entry-time">時間</Label>
          <Input id="entry-time" v-model="time" type="datetime-local" required />
        </div>
        <div class="space-y-2">
          <Label for="entry-reason">原因</Label>
          <Input id="entry-reason" v-model="reason" placeholder="簡述觸發情境" required />
        </div>
        <div class="space-y-2">
          <Label>罰款金額</Label>
          <div class="flex gap-2 flex-wrap">
            <Button
              v-for="p in presets"
              :key="p.value"
              type="button"
              :variant="fine === p.value && !customFine ? 'default' : 'outline'"
              size="sm"
              @click="selectFine(p.value)"
            >
              {{ p.label }}
            </Button>
            <Button
              type="button"
              :variant="customFine ? 'default' : 'outline'"
              size="sm"
              @click="customFine = true"
            >
              自訂
            </Button>
          </div>
          <Input
            v-if="customFine"
            v-model.number="fine"
            type="number"
            min="1"
            class="mt-2"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">取消</Button>
          <Button type="submit">{{ entry ? '儲存' : '新增' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
