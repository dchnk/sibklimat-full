<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '#imports'
import { CircleCheckBig, ShieldCheck, Sparkles, Timer } from 'lucide-vue-next'

const { t } = useI18n()

const kpiKeys = ['projects', 'response', 'warranty'] as const
const assuranceKeys = ['certified', 'transparent', 'support'] as const
const quickDialogKeys = ['audit', 'equipment', 'budget'] as const
</script>

<template>
  <section class="landing-section pb-10 pt-6 md:pt-10">
    <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <Badge
          variant="secondary"
          class="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em]"
        >
          {{ t('landing.hero.badge') }}
        </Badge>

        <div class="space-y-4">
          <h1 class="text-4xl font-semibold leading-tight md:text-6xl">
            {{ t('landing.hero.title') }}
          </h1>

          <p class="max-w-2xl text-base text-muted-foreground md:text-lg">
            {{ t('landing.hero.subtitle') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <Button
            as-child
            size="lg"
          >
            <a href="#contact">
              <Sparkles class="size-4" />
              {{ t('landing.hero.primaryCta') }}
            </a>
          </Button>

          <Dialog>
            <DialogTrigger as-child>
              <Button
                variant="outline"
                size="lg"
              >
                <Timer class="size-4" />
                {{ t('landing.hero.secondaryCta') }}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {{ t('landing.hero.quickDialog.title') }}
                </DialogTitle>
                <DialogDescription>
                  {{ t('landing.hero.quickDialog.description') }}
                </DialogDescription>
              </DialogHeader>

              <div class="space-y-3">
                <div
                  v-for="item in quickDialogKeys"
                  :key="item"
                  class="flex items-start gap-2 rounded-lg border border-border/75 bg-card/88 p-3"
                >
                  <CircleCheckBig class="mt-0.5 size-4 text-primary" />
                  <p class="text-sm text-muted-foreground">
                    {{ t(`landing.hero.quickDialog.items.${item}`) }}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <Card
            v-for="kpi in kpiKeys"
            :key="kpi"
            class="gap-2 border-border/75 bg-card/92 p-4"
          >
            <p class="text-2xl font-semibold">
              {{ t(`landing.hero.kpis.${kpi}.value`) }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ t(`landing.hero.kpis.${kpi}.label`) }}
            </p>
          </Card>
        </div>
      </div>

      <Card class="gap-4 overflow-hidden border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader class="gap-3">
          <div class="flex items-center justify-between gap-3">
            <CardTitle class="text-lg md:text-xl">
              {{ t('landing.hero.panel.title') }}
            </CardTitle>
            <ShieldCheck class="size-5 text-primary" />
          </div>
          <CardDescription>
            {{ t('landing.hero.panel.description') }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="landing-media-placeholder aspect-[4/3]">
            <div class="landing-media-placeholder-inner">
              <p class="text-sm font-medium">
                {{ t('landing.hero.panel.mediaTitle') }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ t('landing.hero.panel.mediaDescription') }}
              </p>
            </div>
          </div>

          <Separator />

          <ul class="space-y-2">
            <li
              v-for="item in assuranceKeys"
              :key="item"
              class="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CircleCheckBig class="mt-0.5 size-4 text-primary" />
              {{ t(`landing.hero.panel.points.${item}`) }}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
