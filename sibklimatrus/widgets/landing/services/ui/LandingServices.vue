<script setup lang="ts">
import type { Component } from 'vue'
import type {
  LandingServiceIconKey,
  LandingServicesContent
} from '@/entities/landing/page'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Building2,
  Factory,
  Home,
  Settings2,
  Wind,
  Wrench
} from 'lucide-vue-next'

defineProps<{
  content: LandingServicesContent
}>()

const serviceIcons: Partial<Record<LandingServiceIconKey, Component>> = {
  home: Home,
  building: Building2,
  factory: Factory,
  wind: Wind,
  wrench: Wrench,
  settings: Settings2
}

const fallbackServiceIcon = Settings2
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
        {{ content.badge }}
      </Badge>
      <h2 class="landing-section-title">
        {{ content.title }}
      </h2>
      <p class="landing-section-subtitle">
        {{ content.subtitle }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="service in content.items"
        :key="service.id"
        class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm"
      >
        <CardHeader class="gap-3">
          <div class="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              class="rounded-full"
            >
              <component
                :is="serviceIcons[service.iconKey] ?? fallbackServiceIcon"
                class="mr-1 size-3.5"
              />
              {{ service.chip }}
            </Badge>
          </div>

          <CardTitle class="text-lg">
            {{ service.title }}
          </CardTitle>

          <CardDescription>
            {{ service.description }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
          <img
            v-if="service.image?.url"
            :src="service.image.url"
            :alt="service.image.alternativeText ?? service.title"
            :width="service.image.width ?? 1200"
            :height="service.image.height ?? 525"
            loading="lazy"
            class="aspect-[16/7] w-full rounded-xl border border-border/80 object-cover"
          >
          <div
            v-else
            class="landing-media-placeholder aspect-[16/7]"
          >
            <div class="landing-media-placeholder-inner">
              <p class="text-xs text-muted-foreground">
                {{ content.mediaPlaceholder }}
              </p>
            </div>
          </div>

          <ul class="space-y-1.5 text-sm text-muted-foreground">
            <li
              v-for="point in service.points"
              :key="point.id"
            >
              - {{ point.text }}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
