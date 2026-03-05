<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { landingSteps } from "@/entities/landing/model/content"
</script>

<template>
  <section id="process" class="mt-10">
    <Card class="rounded-[2rem] border-slate-200/70 bg-white/90 py-7 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.35)] md:py-10">
      <CardHeader class="px-7 md:px-10">
        <Badge class="border-transparent p-0 font-semibold uppercase tracking-[0.24em] text-teal-700 hover:bg-transparent">
          Как работаем
        </Badge>
      </CardHeader>
      <CardContent class="mt-2 px-7 md:px-10">
        <div class="grid gap-5 lg:grid-cols-4">
          <Card
            v-for="(step, index) in landingSteps"
            :key="step"
            class="gap-0 rounded-3xl border-slate-200 bg-slate-50/90 py-5 shadow-none"
          >
            <CardContent class="px-5">
              <p class="text-sm font-semibold text-teal-700">Шаг {{ index + 1 }}</p>
              <p class="mt-3 text-base leading-7 text-slate-700">{{ step }}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
