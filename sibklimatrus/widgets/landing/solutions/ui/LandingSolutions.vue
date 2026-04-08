<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { solutionTabs } from '@/entities/landing/page'
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <section
    id="solutions"
    class="landing-section"
  >
    <div class="landing-section-head">
      <Badge
        variant="secondary"
        class="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em]"
      >
        {{ t('landing.solutions.badge') }}
      </Badge>
      <h2 class="landing-section-title">
        {{ t('landing.solutions.title') }}
      </h2>
      <p class="landing-section-subtitle">
        {{ t('landing.solutions.subtitle') }}
      </p>
    </div>

    <Tabs
      default-value="apartments"
      class="gap-5"
    >
      <TabsList class="h-auto w-full justify-start overflow-x-auto rounded-xl bg-card/70 p-1.5">
        <TabsTrigger
          v-for="tab in solutionTabs"
          :key="tab.value"
          :value="tab.value"
          class="rounded-lg px-4 py-2"
        >
          {{ t(`landing.solutions.tabs.${tab.value}.label`) }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="tab in solutionTabs"
        :key="tab.value"
        :value="tab.value"
      >
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="cardKey in tab.cardKeys"
            :key="cardKey"
            class="gap-4 border-border/70 bg-card/70 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle class="text-lg">
                {{ t(`landing.solutions.tabs.${tab.value}.cards.${cardKey}.title`) }}
              </CardTitle>
              <CardDescription>
                {{ t(`landing.solutions.tabs.${tab.value}.cards.${cardKey}.description`) }}
              </CardDescription>
            </CardHeader>

            <CardContent class="space-y-3">
              <div class="landing-media-placeholder aspect-[16/8]">
                <div class="landing-media-placeholder-inner">
                  <p class="text-xs text-muted-foreground">
                    {{ t('landing.mediaPlaceholder') }}
                  </p>
                </div>
              </div>

              <ul class="space-y-1.5 text-sm text-muted-foreground">
                <li>- {{ t(`landing.solutions.tabs.${tab.value}.cards.${cardKey}.point1`) }}</li>
                <li>- {{ t(`landing.solutions.tabs.${tab.value}.cards.${cardKey}.point2`) }}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>
