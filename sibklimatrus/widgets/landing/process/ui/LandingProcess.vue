<script setup lang="ts">
import type { LandingProcessContent } from '@/entities/landing/page'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

defineProps<{
  content: LandingProcessContent
}>()
</script>

<template>
  <section
    id="process"
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

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card
        v-for="(step, index) in content.steps"
        :key="step.id"
        class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm"
      >
        <CardHeader class="gap-2">
          <Badge
            variant="outline"
            class="w-fit rounded-full"
          >
            {{ index + 1 }}
          </Badge>
          <CardTitle class="text-base">
            {{ step.title }}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>
            {{ step.description }}
          </CardDescription>
        </CardContent>
      </Card>
    </div>

    <Card class="mt-5 gap-3 border-border/75 bg-card/90">
      <CardContent class="grid gap-4 p-6 md:grid-cols-3 md:items-center">
        <div
          v-for="(metric, index) in content.metrics"
          :key="metric.id"
          class="space-y-1"
          :class="index > 0 ? 'md:border-l md:border-border/70 md:pl-4' : ''"
        >
          <p class="text-xl font-semibold md:text-2xl">
            {{ metric.value }}
          </p>
          <p class="text-xs text-muted-foreground md:text-sm">
            {{ metric.label }}
          </p>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
