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
      class="relative inline-flex items-center"
    >
      <Sun
        class="pointer-events-none absolute left-1 size-3 text-amber-500/95 transition-opacity duration-300"
        :class="isDark ? 'opacity-35' : 'opacity-100'"
      />
      <Moon
        class="pointer-events-none absolute right-1 size-3 text-cyan-700/95 transition-opacity duration-300"
        :class="isDark ? 'opacity-100' : 'opacity-35'"
      />

      <Switch
        v-model="themeSwitchModel"
        :aria-label="toggleLabel"
        :title="toggleLabel"
        class="h-6 w-10 rounded-full border border-border/75 bg-cyan-300/85 shadow-sm transition-colors duration-300 ease-out data-[state=checked]:bg-slate-700/90 dark:data-[state=checked]:bg-slate-700/90 dark:data-[state=unchecked]:bg-cyan-500/80 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:shadow-sm [&_[data-slot=switch-thumb]]:ring-1 [&_[data-slot=switch-thumb]]:ring-black/10"
      >
        <template #thumb>
          <span class="grid size-full place-items-center rounded-full bg-white">
            <Sun
              v-if="!isDark"
              class="size-3 text-amber-500"
            />
            <Moon
              v-else
              class="size-3 text-cyan-700"
            />
          </span>
        </template>

        <span class="sr-only">
          {{ toggleLabel }}
        </span>
      </Switch>
    </div>
    <span
      v-else
      class="inline-flex h-6 w-10 rounded-full border border-border/75 bg-card/90"
    />

    <template #fallback>
      <span class="inline-flex h-6 w-10 rounded-full border border-border/75 bg-card/90" />
    </template>
  </ClientOnly>
</template>
