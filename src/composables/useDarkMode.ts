import { ref, watch } from 'vue'

const STORAGE_KEY = 'swear-jar-theme'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem(STORAGE_KEY) as Theme) || 'system')

function applyTheme(t: Theme) {
  const isDark =
    t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
}

// Apply on load
applyTheme(theme.value)

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (theme.value === 'system') applyTheme('system')
})

watch(theme, (t) => {
  localStorage.setItem(STORAGE_KEY, t)
  applyTheme(t)
})

export function useDarkMode() {
  const isDark = ref(document.documentElement.classList.contains('dark'))

  watch(theme, () => {
    isDark.value = document.documentElement.classList.contains('dark')
  })

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    isDark.value = document.documentElement.classList.contains('dark')
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  return { isDark, theme, toggle, setTheme }
}
