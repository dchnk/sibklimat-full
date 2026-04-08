<script setup lang="ts">
import { ref } from 'vue'
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
import { contactChannelKeys } from '@/entities/landing/page'
import { useI18n } from '#imports'
import { Mail, MapPin, Phone } from 'lucide-vue-next'

const { t } = useI18n()

const name = ref('')
const phone = ref('')
const requestType = ref('consultation')
const details = ref('')
const agree = ref(false)

const contactLinks = {
  phone: 'tel:+73832120000',
  email: 'mailto:hello@sibklimat.ru',
  location: 'https://yandex.ru/maps'
} as const

const contactIcons = {
  phone: Phone,
  email: Mail,
  location: MapPin
} as const
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
        {{ t('landing.contact.badge') }}
      </Badge>
      <h2 class="landing-section-title">
        {{ t('landing.contact.title') }}
      </h2>
      <p class="landing-section-subtitle">
        {{ t('landing.contact.subtitle') }}
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <Card class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader class="space-y-3">
          <CardTitle class="text-xl">
            {{ t('landing.contact.directTitle') }}
          </CardTitle>
          <CardDescription>
            {{ t('landing.contact.directDescription') }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
          <a
            v-for="channel in contactChannelKeys"
            :key="channel"
            :href="contactLinks[channel]"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-border/75 bg-background/90 p-3 transition-colors hover:bg-accent/70"
          >
            <component
              :is="contactIcons[channel]"
              class="size-4 text-primary"
            />
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {{ t(`landing.contact.channels.${channel}.label`) }}
              </p>
              <p class="truncate text-sm font-medium">
                {{ t(`landing.contact.channels.${channel}.value`) }}
              </p>
            </div>
          </a>

          <div class="landing-media-placeholder mt-4 aspect-[16/8]">
            <div class="landing-media-placeholder-inner">
              <p class="text-sm font-medium">
                {{ t('landing.contact.mapPlaceholderTitle') }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ t('landing.contact.mapPlaceholderDescription') }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-4 border-border/75 bg-card/92 backdrop-blur-sm">
        <CardHeader>
          <CardTitle class="text-xl">
            {{ t('landing.contact.form.title') }}
          </CardTitle>
          <CardDescription>
            {{ t('landing.contact.form.description') }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="landing-name">
                {{ t('landing.contact.form.fields.name') }}
              </Label>
              <Input
                id="landing-name"
                v-model="name"
                :placeholder="t('landing.contact.form.placeholders.name')"
              />
            </div>

            <div class="space-y-2">
              <Label for="landing-phone">
                {{ t('landing.contact.form.fields.phone') }}
              </Label>
              <Input
                id="landing-phone"
                v-model="phone"
                :placeholder="t('landing.contact.form.placeholders.phone')"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="landing-request-type">
              {{ t('landing.contact.form.fields.requestType') }}
            </Label>
            <Select v-model="requestType">
              <SelectTrigger id="landing-request-type">
                <SelectValue :placeholder="t('landing.contact.form.placeholders.requestType')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">
                  {{ t('landing.contact.form.options.consultation') }}
                </SelectItem>
                <SelectItem value="installation">
                  {{ t('landing.contact.form.options.installation') }}
                </SelectItem>
                <SelectItem value="service">
                  {{ t('landing.contact.form.options.service') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="landing-details">
              {{ t('landing.contact.form.fields.details') }}
            </Label>
            <Textarea
              id="landing-details"
              v-model="details"
              class="min-h-24"
              :placeholder="t('landing.contact.form.placeholders.details')"
            />
          </div>

          <Label class="gap-3 rounded-lg border border-border/75 bg-background/90 p-3 text-sm text-muted-foreground">
            <Checkbox
              :checked="agree"
              @update:checked="(value: boolean | 'indeterminate') => { agree = value === true }"
            />
            {{ t('landing.contact.form.agreement') }}
          </Label>

          <Button
            class="w-full"
            size="lg"
          >
            {{ t('landing.contact.form.submit') }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
