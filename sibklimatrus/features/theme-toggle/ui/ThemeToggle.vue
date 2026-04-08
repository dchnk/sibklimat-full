<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useThemeMode } from '../model/use-theme-mode'
import { useI18n } from '#imports'

const { t } = useI18n()
const { isDark, toggleMode, isReady } = useThemeMode()

const toggleLabel = computed(() =>
  isDark.value
    ? t('theme.toggleToLight')
    : t('theme.toggleToDark')
)
</script>

<template>
  <ClientOnly>
    <Button
      v-if="isReady"
      type="button"
      variant="ghost"
      size="sm"
      class="h-9 rounded-full border border-border/70 bg-background/70 px-2 shadow-sm backdrop-blur-md hover:bg-accent/80"
      :aria-label="toggleLabel"
      :title="toggleLabel"
      @click="toggleMode"
    >
      <span class="relative flex h-6 w-11 items-center rounded-full bg-muted/80 ring-1 ring-border/70">
        <Sun class="absolute left-1 size-3 text-amber-500/90" />
        <Moon class="absolute right-1 size-3 text-cyan-500/90" />

        <span
          class="relative z-10 size-5 rounded-full bg-background shadow-sm ring-1 ring-border/70 transition-transform duration-300"
          :class="isDark ? 'translate-x-5' : 'translate-x-0'"
        />
      </span>

      <span class="sr-only">
        {{ toggleLabel }}
      </span>
    </Button>
    <span
      v-else
      class="inline-flex h-9 w-[54px] rounded-full border border-border/70 bg-background/70"
    />

    <template #fallback>
      <span class="inline-flex h-9 w-[54px] rounded-full border border-border/70 bg-background/70" />
    </template>
  </ClientOnly>
</template>
