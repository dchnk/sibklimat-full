import { computed, onMounted, ref } from 'vue'
import { useState } from '#imports'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'sibklimat:theme-mode'

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark'

const getPreferredThemeMode = (): ThemeMode => {
  if (!process.client) {
    return 'light'
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (isThemeMode(savedTheme)) {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyThemeClass = (mode: ThemeMode) => {
  if (!process.client) {
    return
  }

  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export const useThemeMode = () => {
  const mode = useState<ThemeMode>('theme:mode', () => 'light')
  const isReady = ref(false)

  const setMode = (nextMode: ThemeMode) => {
    mode.value = nextMode
    applyThemeClass(nextMode)

    if (process.client) {
      window.localStorage.setItem(STORAGE_KEY, nextMode)
    }
  }

  const toggleMode = () => {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const initialMode = getPreferredThemeMode()
    mode.value = initialMode
    applyThemeClass(initialMode)
    isReady.value = true
  })

  return {
    mode: computed(() => mode.value),
    isDark: computed(() => mode.value === 'dark'),
    isReady: computed(() => isReady.value),
    setMode,
    toggleMode
  }
}
