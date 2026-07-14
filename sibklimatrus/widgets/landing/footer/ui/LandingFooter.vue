<script setup lang="ts">
import type { LandingFooterContent } from '@/entities/landing/page'
import { Separator } from '@/components/ui/separator'

defineProps<{
  content: LandingFooterContent
}>()
</script>

<template>
  <footer class="pb-10 pt-6">
    <Separator class="mb-6" />
    <div class="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <p>{{ content.copyright }}</p>
      <p>{{ content.note }}</p>
    </div>
  </footer>
</template>
