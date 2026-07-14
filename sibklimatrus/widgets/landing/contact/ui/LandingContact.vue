<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Component } from 'vue'
import type {
  LandingContactChannelType,
  LandingContactContent
} from '@/entities/landing/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-vue-next'

const props = defineProps<{
  content: LandingContactContent
}>()

const name = ref('')
const phone = ref('')
const requestType = ref(props.content.form.options[0]?.value ?? '')
const details = ref('')
const agree = ref(false)

watch(
  () => props.content.form.options.map((option) => option.value),
  (optionValues) => {
    if (!optionValues.includes(requestType.value)) {
      requestType.value = optionValues[0] ?? ''
    }
  }
)

const contactIcons: Record<LandingContactChannelType, Component> = {
  phone: Phone,
  email: Mail,
  location: MapPin,
  other: MessageCircle
}
</script>

<template>
  <section
    id="contact"
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

    <div class="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <Card class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader class="space-y-3">
          <CardTitle class="text-xl">
            {{ content.directTitle }}
          </CardTitle>
          <CardDescription>
            {{ content.directDescription }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
          <a
            v-for="channel in content.channels"
            :key="channel.id"
            :href="channel.href"
            :target="channel.openInNewTab ? '_blank' : undefined"
            :rel="channel.openInNewTab ? 'noopener noreferrer' : undefined"
            class="flex items-center gap-3 rounded-xl border border-border/75 bg-background/90 p-3 transition-colors hover:bg-accent/70"
          >
            <component
              :is="contactIcons[channel.type]"
              class="size-4 text-primary"
            />
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {{ channel.label }}
              </p>
              <p class="truncate text-sm font-medium">
                {{ channel.value }}
              </p>
            </div>
          </a>

          <img
            v-if="content.mapImage?.url"
            :src="content.mapImage.url"
            :alt="content.mapImage.alternativeText ?? content.mapPlaceholderTitle"
            :width="content.mapImage.width ?? 1200"
            :height="content.mapImage.height ?? 600"
            loading="lazy"
            class="mt-4 aspect-[16/8] w-full rounded-xl border border-border/80 object-cover"
          >
          <div
            v-else
            class="landing-media-placeholder mt-4 aspect-[16/8]"
          >
            <div class="landing-media-placeholder-inner">
              <p class="text-sm font-medium">
                {{ content.mapPlaceholderTitle }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ content.mapPlaceholderDescription }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-xl">
            {{ content.form.title }}
          </CardTitle>
          <CardDescription>
            {{ content.form.description }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="landing-name">
                {{ content.form.nameLabel }}
              </Label>
              <Input
                id="landing-name"
                v-model="name"
                :placeholder="content.form.namePlaceholder"
              />
            </div>

            <div class="space-y-2">
              <Label for="landing-phone">
                {{ content.form.phoneLabel }}
              </Label>
              <Input
                id="landing-phone"
                v-model="phone"
                :placeholder="content.form.phonePlaceholder"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="landing-request-type">
              {{ content.form.requestTypeLabel }}
            </Label>
            <Select v-model="requestType">
              <SelectTrigger id="landing-request-type">
                <SelectValue :placeholder="content.form.requestTypePlaceholder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in content.form.options"
                  :key="option.id"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="landing-details">
              {{ content.form.detailsLabel }}
            </Label>
            <Textarea
              id="landing-details"
              v-model="details"
              class="min-h-24"
              :placeholder="content.form.detailsPlaceholder"
            />
          </div>

          <Label class="gap-3 rounded-lg border border-border/75 bg-background/90 p-3 text-sm text-muted-foreground">
            <Checkbox v-model="agree" />
            {{ content.form.agreementLabel }}
          </Label>

          <Button
            class="w-full"
            size="lg"
          >
            {{ content.form.submitLabel }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
