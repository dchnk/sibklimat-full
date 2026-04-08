<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { processStepKeys } from '@/entities/landing/page'
import { useI18n } from '#imports'

const { t } = useI18n()

const metricKeys = ['speed', 'accuracy', 'support'] as const
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
        {{ t('landing.process.badge') }}
      </Badge>
      <h2 class="landing-section-title">
        {{ t('landing.process.title') }}
      </h2>
      <p class="landing-section-subtitle">
        {{ t('landing.process.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <Card
        v-for="(step, index) in processStepKeys"
        :key="step"
        class="gap-4 border-border/70 bg-card/70 backdrop-blur-sm"
      >
        <CardHeader class="gap-2">
          <Badge
            variant="outline"
            class="w-fit rounded-full"
          >
            {{ index + 1 }}
          </Badge>
          <CardTitle class="text-base">
            {{ t(`landing.process.steps.${step}.title`) }}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>
            {{ t(`landing.process.steps.${step}.description`) }}
          </CardDescription>
        </CardContent>
      </Card>
    </div>

    <Card class="mt-5 gap-3 border-border/70 bg-card/70">
      <CardContent class="grid gap-4 p-6 md:grid-cols-3 md:items-center">
        <div
          v-for="(metricKey, index) in metricKeys"
          :key="metricKey"
          class="space-y-1"
          :class="index > 0 ? 'md:border-l md:border-border/70 md:pl-4' : ''"
        >
          <p class="text-xl font-semibold md:text-2xl">
            {{ t(`landing.process.metrics.${metricKey}.value`) }}
          </p>
          <p class="text-xs text-muted-foreground md:text-sm">
            {{ t(`landing.process.metrics.${metricKey}.label`) }}
          </p>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
