<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="$props.class"
  >
    <!-- Lid -->
    <path d="M8 4h8a1 1 0 0 1 1 1v1H7V5a1 1 0 0 1 1-1z" />
    <!-- Jar body -->
    <path d="M7 6c-.6 1-1 2.5-1 4v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8c0-1.5-.4-3-1-4" />
    <!-- Dollar sign -->
    <path d="M12 11v6" />
    <path d="M14 12.5c0-.8-.9-1.5-2-1.5s-2 .7-2 1.5.9 1.5 2 1.5 2 .7 2 1.5-.9 1.5-2 1.5" />
  </svg>
</template>