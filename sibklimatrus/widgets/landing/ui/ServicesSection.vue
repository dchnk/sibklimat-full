<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { landingServices } from "@/entities/landing/model/content"
</script>

<template>
  <section id="services" class="mt-10">
    <Card class="rounded-[2rem] border-slate-200/70 bg-white/90 py-7 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.35)] md:py-10">
      <CardHeader class="flex flex-col gap-3 px-7 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Badge class="border-transparent p-0 font-semibold uppercase tracking-[0.24em] text-teal-700 hover:bg-transparent">
            Основные услуги
          </Badge>
          <CardTitle class="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
            Полный цикл климатических работ
          </CardTitle>
        </div>
        <CardDescription class="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
          Не просто продаём оборудование, а отвечаем за результат на объекте: от выбора
          модели до запуска и регламентного обслуживания.
        </CardDescription>
      </CardHeader>
      <CardContent class="mt-2 px-7 md:px-10">
        <div class="grid gap-4 md:grid-cols-2">
          <Card
            v-for="service in landingServices"
            :key="service.title"
            class="gap-0 rounded-3xl border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] py-6 shadow-none"
          >
            <CardHeader class="px-6">
              <CardTitle class="text-lg font-semibold text-slate-950">{{ service.title }}</CardTitle>
              <CardDescription class="mt-2 text-sm leading-7 text-slate-600">
                {{ service.text }}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
