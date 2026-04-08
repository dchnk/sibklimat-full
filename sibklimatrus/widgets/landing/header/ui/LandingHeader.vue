<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LandingHeaderContent } from '@/entities/landing/header'
import { landingHeaderContent, resolveHeaderText } from '@/entities/landing/header'
import { ThemeToggle } from '@/features/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useI18n } from '#imports'
import { Menu } from 'lucide-vue-next'

interface Props {
  content?: LandingHeaderContent
}

const props = defineProps<Props>()

const { t } = useI18n()
const isMobileMenuOpen = ref(false)

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

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="landing-header-shell">
    <div class="landing-layout-container">
      <div class="flex h-16 items-center justify-between gap-3">
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

          <Sheet v-model:open="isMobileMenuOpen">
            <SheetTrigger as-child>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                class="md:hidden"
                :aria-label="t('landing.header.menuOpen')"
                :title="t('landing.header.menuOpen')"
              >
                <Menu class="size-4" />
                <span class="sr-only">
                  {{ t('landing.header.menuOpen') }}
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              class="w-[min(22rem,calc(100%-1rem))] border-border/80 bg-background/95 p-0 backdrop-blur-xl"
            >
              <SheetHeader class="border-b border-border/70 px-5 py-4 text-left">
                <SheetTitle class="text-xs uppercase tracking-brand text-primary">
                  {{ headerContent.brand }}
                </SheetTitle>
                <SheetDescription class="text-sm">
                  {{ headerContent.tagline }}
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                class="flex flex-col gap-1 px-3 py-4"
              >
                <SheetClose
                  v-for="item in headerContent.navigation"
                  :key="item.id"
                  as-child
                >
                  <a
                    :href="item.href"
                    class="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    @click="closeMobileMenu"
                  >
                    {{ item.label }}
                  </a>
                </SheetClose>

                <SheetClose as-child>
                  <Button
                    as-child
                    size="sm"
                    class="mt-2 w-full"
                  >
                    <a
                      :href="headerContent.cta.href"
                      @click="closeMobileMenu"
                    >
                      {{ headerContent.cta.label }}
                    </a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

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
    </div>
  </header>
</template>
