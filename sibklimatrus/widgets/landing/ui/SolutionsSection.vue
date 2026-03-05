<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { landingProductGroups } from "@/entities/landing/model/content"
</script>

<template>
  <section id="solutions" class="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
    <Card class="rounded-[2rem] border-transparent bg-[linear-gradient(180deg,_#0f172a_0%,_#102f38_100%)] py-7 text-white md:py-9">
      <CardHeader class="px-7 md:px-9">
        <Badge class="border-transparent p-0 font-semibold uppercase tracking-[0.24em] text-cyan-300 hover:bg-transparent">
          Что подбираем
        </Badge>
        <CardTitle class="mt-3 text-3xl font-semibold md:text-4xl">Решения под разные типы объектов</CardTitle>
        <CardDescription class="mt-3 text-sm leading-7 text-slate-300 md:text-base">
          Подбираем технику без переплаты за лишнюю мощность и без типичной ошибки с
          недооценкой теплопритоков.
        </CardDescription>
      </CardHeader>
    </Card>
    <div class="grid gap-4 sm:grid-cols-2">
      <Card
        v-for="group in landingProductGroups"
        :key="group"
        class="gap-0 rounded-[1.75rem] border-slate-200/70 bg-white/90 py-6 text-sm font-medium leading-7 text-slate-700 shadow-[0_20px_70px_-50px_rgba(15,23,42,0.45)]"
      >
        <CardContent class="px-6">{{ group }}</CardContent>
      </Card>
    </div>
  </section>
</template>
