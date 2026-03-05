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
</script>

<template>
  <section id="contact" class="mt-10">
    <Card
      class="rounded-[2rem] border-transparent bg-[linear-gradient(135deg,_#115e59_0%,_#0f172a_60%,_#082f49_100%)] py-7 text-white shadow-[0_35px_100px_-50px_rgba(8,47,73,0.7)] md:py-10"
    >
      <CardContent class="grid gap-8 px-7 md:px-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <Badge class="border-transparent p-0 font-semibold uppercase tracking-[0.24em] text-cyan-200 hover:bg-transparent">
            Связь и выезд
          </Badge>
          <CardTitle class="mt-4 text-3xl font-semibold md:text-5xl">
            Подготовим смету и предложим рабочее решение под ваш объект
          </CardTitle>
          <CardDescription class="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
            Если уже идёт ремонт, можем сразу согласовать трассы под кондиционер. Если объект
            действующий, подберём монтаж с минимальным вмешательством в отделку.
          </CardDescription>
        </div>
        <Card class="gap-0 rounded-[1.75rem] border-white/10 bg-white/10 py-6 text-white shadow-none backdrop-blur">
          <CardHeader class="px-6">
            <CardTitle class="text-lg font-semibold">Что можно обсудить на первом контакте</CardTitle>
          </CardHeader>
          <CardContent class="px-6">
            <ul class="space-y-3 text-sm leading-7 text-slate-200">
              <li>Площадь помещения и количество комнат</li>
              <li>Нужен ли только кондиционер или ещё вентиляция</li>
              <li>Есть ли ремонт, готовая отделка или коммерческий объект</li>
              <li>Желаемый бюджет и сроки установки</li>
            </ul>
            <Button
              as-child
              size="lg"
              class="mt-6 rounded-2xl bg-white px-6 text-slate-950 hover:bg-slate-100"
            >
              <a href="mailto:info@sibklimat.ru">Написать для расчёта</a>
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </section>
</template>
