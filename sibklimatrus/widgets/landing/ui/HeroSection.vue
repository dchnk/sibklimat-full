<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { landingFeatures, landingStats } from "@/entities/landing/model/content"
</script>

<template>
  <section class="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
    <Card class="animate-in fade-in slide-in-from-bottom-4 duration-700 rounded-[2rem] border-slate-200/70 bg-white/90 py-7 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur md:py-10">
      <CardHeader class="px-7 md:px-10">
        <Badge class="rounded-full border-teal-200 bg-teal-50 px-3 py-1 font-semibold uppercase tracking-[0.24em] text-teal-800 hover:bg-teal-50">
          Подбор, монтаж, обслуживание
        </Badge>
        <CardTitle class="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
          Комфортный климат для квартиры, дома и бизнеса без затяжного монтажа.
        </CardTitle>
        <CardDescription class="mt-3 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          Помогаем выбрать кондиционер под реальную нагрузку, устанавливаем аккуратно и
          проектируем вентиляцию так, чтобы система работала тихо, стабильно и без
          лишних расходов.
        </CardDescription>
      </CardHeader>
      <CardContent class="px-7 md:px-10">
        <div class="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button
            as-child
            size="lg"
            class="rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800"
          >
            <a href="#contact">Получить расчёт</a>
          </Button>
          <Button
            as-child
            size="lg"
            variant="outline"
            class="rounded-2xl border-slate-300 bg-white px-6 text-slate-900 hover:border-teal-600 hover:bg-white hover:text-teal-700"
          >
            <a href="#services">Посмотреть услуги</a>
          </Button>
        </div>
        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <Card
            v-for="feature in landingFeatures"
            :key="feature"
            class="gap-0 rounded-2xl border-slate-200 bg-slate-50/80 py-3 shadow-none"
          >
            <CardContent class="px-4 text-sm leading-6 text-slate-700">
              {{ feature }}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card class="animate-in fade-in slide-in-from-bottom-6 duration-1000 rounded-[2rem] border-white/10 bg-slate-950 py-6 text-white shadow-[0_35px_100px_-50px_rgba(2,132,199,0.65)] md:py-8">
      <CardContent class="px-6 md:px-8">
        <Card class="gap-0 rounded-3xl border-white/10 bg-white/5 py-5 text-white shadow-none">
          <CardHeader class="px-5">
            <Badge class="border-transparent p-0 font-semibold uppercase tracking-[0.26em] text-teal-300 hover:bg-transparent">
              Выезд по Новосибирску
            </Badge>
            <CardTitle class="mt-3 text-3xl font-semibold">Поможем подобрать систему за один разговор</CardTitle>
            <CardDescription class="mt-3 text-sm leading-7 text-slate-300">
              Для новых объектов, ремонта и замены старого оборудования. Сразу учитываем
              площадь, высоту потолков, количество комнат и сценарий использования.
            </CardDescription>
          </CardHeader>
        </Card>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Card
            v-for="item in landingStats"
            :key="item.label"
            class="gap-0 rounded-3xl border-white/10 bg-white/5 py-4 text-white shadow-none"
          >
            <CardContent class="px-5">
              <p class="text-2xl font-semibold text-white">{{ item.value }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ item.label }}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
