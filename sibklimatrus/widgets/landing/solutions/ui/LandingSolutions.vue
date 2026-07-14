<script setup lang="ts">
import { ref, watch } from 'vue'
import type { LandingSolutionsContent } from '@/entities/landing/page'
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

const props = defineProps<{
  content: LandingSolutionsContent
}>()

const activeTab = ref(props.content.tabs[0]?.id ?? '')

watch(
  () => props.content.tabs.map((tab) => tab.id),
  (tabIds) => {
    if (!tabIds.includes(activeTab.value)) {
      activeTab.value = tabIds[0] ?? ''
    }
  }
)
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
        {{ content.badge }}
      </Badge>
      <h2 class="landing-section-title">
        {{ content.title }}
      </h2>
      <p class="landing-section-subtitle">
        {{ content.subtitle }}
      </p>
    </div>

    <Tabs
      v-model="activeTab"
      class="gap-5"
    >
      <TabsList class="h-auto w-full justify-start overflow-x-auto rounded-xl bg-card/86 p-1.5">
        <TabsTrigger
          v-for="tab in content.tabs"
          :key="tab.id"
          :value="tab.id"
          class="rounded-lg px-4 py-2"
        >
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="tab in content.tabs"
        :key="tab.id"
        :value="tab.id"
      >
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="card in tab.cards"
            :key="card.id"
            class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle class="text-lg">
                {{ card.title }}
              </CardTitle>
              <CardDescription>
                {{ card.description }}
              </CardDescription>
            </CardHeader>

            <CardContent class="space-y-3">
              <img
                v-if="card.image?.url"
                :src="card.image.url"
                :alt="card.image.alternativeText ?? card.title"
                :width="card.image.width ?? 1200"
                :height="card.image.height ?? 600"
                loading="lazy"
                class="aspect-[16/8] w-full rounded-xl border border-border/80 object-cover"
              >
              <div
                v-else
                class="landing-media-placeholder aspect-[16/8]"
              >
                <div class="landing-media-placeholder-inner">
                  <p class="text-xs text-muted-foreground">
                    {{ content.mediaPlaceholder }}
                  </p>
                </div>
              </div>

              <ul class="space-y-1.5 text-sm text-muted-foreground">
                <li
                  v-for="point in card.points"
                  :key="point.id"
                >
                  - {{ point.text }}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>
