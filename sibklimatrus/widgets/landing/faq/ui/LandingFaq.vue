<script setup lang="ts">
import type { LandingFaqContent } from '@/entities/landing/page'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

defineProps<{
  content: LandingFaqContent
}>()
</script>

<template>
  <section class="landing-section">
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

    <Card class="gap-0 border-border/75 bg-card/92 px-5 backdrop-blur-sm md:px-8">
      <Accordion
        type="single"
        collapsible
      >
        <AccordionItem
          v-for="item in content.items"
          :key="item.id"
          :value="item.id"
        >
          <AccordionTrigger class="text-base md:text-lg">
            {{ item.question }}
          </AccordionTrigger>
          <AccordionContent class="text-sm text-muted-foreground md:text-base">
            {{ item.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  </section>
</template>
