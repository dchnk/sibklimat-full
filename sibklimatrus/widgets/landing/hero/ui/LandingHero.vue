<script setup lang="ts">
import type { LandingHeroContent } from '@/entities/landing/page'
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
import { CircleCheckBig, ShieldCheck, Sparkles, Timer } from 'lucide-vue-next'

defineProps<{
  content: LandingHeroContent
}>()
</script>

<template>
  <section class="landing-section pb-10 pt-6 md:pt-10">
    <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <Badge
          variant="secondary"
          class="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em]"
        >
          {{ content.badge }}
        </Badge>

        <div class="space-y-4">
          <h1 class="text-4xl font-semibold leading-tight md:text-6xl">
            {{ content.title }}
          </h1>

          <p class="max-w-2xl text-base text-muted-foreground md:text-lg">
            {{ content.subtitle }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <Button
            as-child
            size="lg"
          >
            <a :href="content.primaryCtaHref">
              <Sparkles class="size-4" />
              {{ content.primaryCtaLabel }}
            </a>
          </Button>

          <Dialog>
            <DialogTrigger as-child>
              <Button
                variant="outline"
                size="lg"
              >
                <Timer class="size-4" />
                {{ content.secondaryCtaLabel }}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {{ content.quickDialogTitle }}
                </DialogTitle>
                <DialogDescription>
                  {{ content.quickDialogDescription }}
                </DialogDescription>
              </DialogHeader>

              <div class="space-y-3">
                <div
                  v-for="item in content.quickDialogItems"
                  :key="item.id"
                  class="flex items-start gap-2 rounded-lg border border-border/75 bg-card/88 p-3"
                >
                  <CircleCheckBig class="mt-0.5 size-4 text-primary" />
                  <p class="text-sm text-muted-foreground">
                    {{ item.text }}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <Card
            v-for="kpi in content.kpis"
            :key="kpi.id"
            class="gap-2 border-border/75 bg-card/92 p-4"
          >
            <p class="text-2xl font-semibold">
              {{ kpi.value }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ kpi.label }}
            </p>
          </Card>
        </div>
      </div>

      <Card class="gap-4 overflow-hidden border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader class="gap-3">
          <div class="flex items-center justify-between gap-3">
            <CardTitle class="text-lg md:text-xl">
              {{ content.panelTitle }}
            </CardTitle>
            <ShieldCheck class="size-5 text-primary" />
          </div>
          <CardDescription>
            {{ content.panelDescription }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="landing-media-placeholder aspect-[4/3]">
            <img
              v-if="content.panelImage?.url"
              :src="content.panelImage.url"
              :alt="content.panelImage.alternativeText ?? content.panelTitle"
              :width="content.panelImage.width ?? 1200"
              :height="content.panelImage.height ?? 900"
              class="absolute inset-0 size-full object-cover"
              loading="eager"
              decoding="async"
            >
            <div
              v-else
              class="landing-media-placeholder-inner"
            >
              <p class="text-sm font-medium">
                {{ content.panelPlaceholderTitle }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ content.panelPlaceholderDescription }}
              </p>
            </div>
          </div>

          <Separator />

          <ul class="space-y-2">
            <li
              v-for="item in content.panelPoints"
              :key="item.id"
              class="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CircleCheckBig class="mt-0.5 size-4 text-primary" />
              {{ item.text }}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
