<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { faqKeys } from '@/entities/landing/page'
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <section class="landing-section">
    <div class="landing-section-head">
      <Badge
        variant="secondary"
        class="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em]"
      >
        {{ t('landing.faq.badge') }}
      </Badge>
      <h2 class="landing-section-title">
        {{ t('landing.faq.title') }}
      </h2>
      <p class="landing-section-subtitle">
        {{ t('landing.faq.subtitle') }}
      </p>
    </div>

    <Card class="gap-0 border-border/75 bg-card/92 px-5 backdrop-blur-sm md:px-8">
      <Accordion
        type="single"
        collapsible
      >
        <AccordionItem
          v-for="faqKey in faqKeys"
          :key="faqKey"
          :value="faqKey"
        >
          <AccordionTrigger class="text-base md:text-lg">
            {{ t(`landing.faq.items.${faqKey}.question`) }}
          </AccordionTrigger>
          <AccordionContent class="text-sm text-muted-foreground md:text-base">
            {{ t(`landing.faq.items.${faqKey}.answer`) }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  </section>
</template>
