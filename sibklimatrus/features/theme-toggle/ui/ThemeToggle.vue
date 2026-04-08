<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Switch } from '@/components/ui/switch'
import { useThemeMode } from '../model/use-theme-mode'
import { useI18n } from '#imports'

const { t } = useI18n()
const { isDark, isReady, setMode } = useThemeMode()

const toggleLabel = computed(() =>
  isDark.value
    ? t('theme.toggleToLight')
    : t('theme.toggleToDark')
)

const themeSwitchModel = computed({
  get: () => isDark.value,
  set: (checked: boolean) => {
    setMode(checked ? 'dark' : 'light')
  }
})
</script>

<template>
  <ClientOnly>
    <div
      v-if="isReady"
      class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-2 py-1 shadow-sm backdrop-blur-md"
    >
      <Sun class="size-3.5 text-amber-500/90" />
      <Switch
        v-model="themeSwitchModel"
        :aria-label="toggleLabel"
        :title="toggleLabel"
      />
      <Moon class="size-3.5 text-cyan-500/90" />

      <span class="sr-only">
        {{ toggleLabel }}
      </span>
    </div>
    <span
      v-else
      class="inline-flex h-9 w-[54px] rounded-full border border-border/70 bg-background/70"
    />

    <template #fallback>
      <span class="inline-flex h-9 w-[54px] rounded-full border border-border/70 bg-background/70" />
    </template>
  </ClientOnly>
</template>
