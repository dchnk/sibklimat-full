<script setup lang="ts">
import { computed } from 'vue'
import type { LandingHeaderContent } from '@/entities/landing/header'
import { landingHeaderContent, resolveHeaderText } from '@/entities/landing/header'
import { ThemeToggle } from '@/features/theme-toggle'
import { Button } from '@/components/ui/button'
import { useI18n } from '#imports'

interface Props {
  content?: LandingHeaderContent
}

const props = defineProps<Props>()

const { t } = useI18n()

const sourceContent = computed(() => props.content ?? landingHeaderContent)

const headerContent = computed(() => ({
  brand: resolveHeaderText(sourceContent.value.brand, t),
  tagline: resolveHeaderText(sourceContent.value.tagline, t),
  navigation: sourceContent.value.navigation.map((item) => ({
    ...item,
    label: resolveHeaderText(item.label, t)
  })),
  cta: {
    ...sourceContent.value.cta,
    label: resolveHeaderText(sourceContent.value.cta.label, t)
  }
}))
</script>

<template>
  <header class="landing-header-shell">
    <div class="landing-layout-container">
      <div class="flex h-16 items-center justify-between gap-4">
        <a href="#top" class="flex min-w-0 flex-col">
          <span class="truncate text-xs font-semibold uppercase tracking-brand text-primary">
            {{ headerContent.brand }}
          </span>
          <span class="truncate text-xs text-muted-foreground sm:text-sm">
            {{ headerContent.tagline }}
          </span>
        </a>

        <nav
          aria-label="Desktop navigation"
          class="hidden items-center gap-1 md:flex"
        >
          <a
            v-for="item in headerContent.navigation"
            :key="item.id"
            :href="item.href"
            class="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <ThemeToggle />

          <Button
            as-child
            size="sm"
            class="hidden md:inline-flex"
          >
            <a :href="headerContent.cta.href">
              {{ headerContent.cta.label }}
            </a>
          </Button>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        class="flex gap-2 overflow-x-auto pb-3 md:hidden"
      >
        <a
          v-for="item in headerContent.navigation"
          :key="item.id"
          :href="item.href"
          class="shrink-0 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {{ item.label }}
        </a>

        <Button
          as-child
          size="sm"
          class="shrink-0"
        >
          <a :href="headerContent.cta.href">
            {{ headerContent.cta.label }}
          </a>
        </Button>
      </nav>
    </div>
  </header>
</template>
