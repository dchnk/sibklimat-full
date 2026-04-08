<script setup lang="ts">
import type { Component } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { serviceKeys } from '@/entities/landing/page'
import { useI18n } from '#imports'
import {
  Building2,
  Factory,
  Home,
  Settings2,
  Wind,
  Wrench
} from 'lucide-vue-next'

const { t } = useI18n()

const serviceIcons: Record<(typeof serviceKeys)[number], Component> = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
  ventilation: Wind,
  service: Wrench,
  automation: Settings2
}
</script>

<template>
  <section
    id="services"
    class="landing-section"
  >
    <div class="landing-section-head">
      <Badge
        variant="secondary"
        class="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em]"
      >
        {{ t('landing.services.badge') }}
      </Badge>
      <h2 class="landing-section-title">
        {{ t('landing.services.title') }}
      </h2>
      <p class="landing-section-subtitle">
        {{ t('landing.services.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="serviceKey in serviceKeys"
        :key="serviceKey"
        class="gap-4 border-border/70 bg-card/70 backdrop-blur-sm"
      >
        <CardHeader class="gap-3">
          <div class="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              class="rounded-full"
            >
              <component
                :is="serviceIcons[serviceKey]"
                class="mr-1 size-3.5"
              />
              {{ t(`landing.services.items.${serviceKey}.chip`) }}
            </Badge>
          </div>

          <CardTitle class="text-lg">
            {{ t(`landing.services.items.${serviceKey}.title`) }}
          </CardTitle>

          <CardDescription>
            {{ t(`landing.services.items.${serviceKey}.description`) }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
          <div class="landing-media-placeholder aspect-[16/7]">
            <div class="landing-media-placeholder-inner">
              <p class="text-xs text-muted-foreground">
                {{ t('landing.mediaPlaceholder') }}
              </p>
            </div>
          </div>

          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li>- {{ t(`landing.services.items.${serviceKey}.point1`) }}</li>
            <li>- {{ t(`landing.services.items.${serviceKey}.point2`) }}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
