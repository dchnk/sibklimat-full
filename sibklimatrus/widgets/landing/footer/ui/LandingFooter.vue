<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <footer class="pb-10 pt-6">
    <Separator class="mb-6" />
    <div class="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <p>{{ t('landing.footer.copyright') }}</p>
      <p>{{ t('landing.footer.note') }}</p>
    </div>
  </footer>
</template>
