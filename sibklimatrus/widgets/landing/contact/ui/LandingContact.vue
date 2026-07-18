<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Component } from 'vue'
import { vMaska } from 'maska/vue'
import { useI18n, useRuntimeConfig } from '#imports'
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
import {
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone
} from 'lucide-vue-next'
import YandexSmartCaptcha from './YandexSmartCaptcha.vue'

const props = defineProps<{
  content: LandingContactContent
}>()

type FormField = 'name' | 'phone' | 'requestType' | 'agreement' | 'captcha'
type CaptchaClientState = 'loading' | 'ready' | 'passed' | 'unavailable'

interface CaptchaWidgetExposed {
  reset: () => void
}

interface SubmissionError {
  statusCode?: number
  response?: {
    status?: number
  }
  data?: {
    statusCode?: number
    data?: {
      code?: string
    }
  }
}

const config = useRuntimeConfig()
const { locale, t } = useI18n()

const name = ref('')
const phone = ref('')
const requestType = ref(props.content.form.options[0]?.value ?? '')
const details = ref('')
const agree = ref(false)
const website = ref('')
const captchaToken = ref('')
const captchaState = ref<CaptchaClientState>(
  config.public.smartCaptchaSiteKey ? 'loading' : 'unavailable'
)
const captchaWidget = ref<CaptchaWidgetExposed | null>(null)
const isSubmitting = ref(false)
const fieldErrors = ref<Partial<Record<FormField, string>>>({})
const feedback = ref<{
  type: 'success' | 'error'
  message: string
} | null>(null)

const smartCaptchaSiteKey = String(
  config.public.smartCaptchaSiteKey || ''
).trim()
const normalizeRussianPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  const nationalNumber =
    digits.length === 10
      ? digits
      : digits.length === 11 && ['7', '8'].includes(digits[0] ?? '')
        ? digits.slice(1)
        : null

  return nationalNumber ? `+7${nationalNumber}` : null
}
const phoneMaskOptions = {
  mask: '+7 (###) ###-##-##',
  preProcess: (value: string) => {
    const digits = value.replace(/\D/g, '')

    return digits.length === 11 && ['7', '8'].includes(digits[0] ?? '')
      ? digits.slice(1)
      : value
  }
}
const captchaLocale = computed<'ru' | 'en'>(() =>
  locale.value === 'en' ? 'en' : 'ru'
)
const isSubmitDisabled = computed(
  () =>
    isSubmitting.value ||
    !agree.value ||
    (captchaState.value === 'ready' && !captchaToken.value)
)

const validateForm = () => {
  const errors: Partial<Record<FormField, string>> = {}
  const normalizedName = name.value.trim()
  const normalizedPhone = normalizeRussianPhone(phone.value)

  if (normalizedName.length < 2 || normalizedName.length > 30) {
    errors.name = t('landing.contact.form.feedback.nameInvalid')
  }

  if (!normalizedPhone) {
    errors.phone = t('landing.contact.form.feedback.phoneInvalid')
  }

  if (
    !props.content.form.options.some(
      (option) => option.value === requestType.value
    )
  ) {
    errors.requestType = t(
      'landing.contact.form.feedback.requestTypeInvalid'
    )
  }

  if (!agree.value) {
    errors.agreement = t('landing.contact.form.feedback.agreementRequired')
  }

  if (captchaState.value === 'ready' && !captchaToken.value) {
    errors.captcha = t('landing.contact.form.feedback.captchaRequired')
  }

  fieldErrors.value = errors

  if (Object.keys(errors).length > 0) {
    feedback.value = {
      type: 'error',
      message: t('landing.contact.form.feedback.validationError')
    }
    return false
  }

  return true
}

const getErrorCode = (error: unknown) => {
  const submissionError = error as SubmissionError
  return submissionError.data?.data?.code
}

const getErrorStatus = (error: unknown) => {
  const submissionError = error as SubmissionError
  return (
    submissionError.statusCode ??
    submissionError.data?.statusCode ??
    submissionError.response?.status
  )
}

const getSubmissionErrorMessage = (error: unknown) => {
  const code = getErrorCode(error)
  const status = getErrorStatus(error)

  if (code === 'RATE_LIMITED' || status === 429) {
    return t('landing.contact.form.feedback.rateLimited')
  }

  if (code === 'VALIDATION_ERROR' || status === 422) {
    return t('landing.contact.form.feedback.validationError')
  }

  return t('landing.contact.form.feedback.submitError')
}

const resetForm = () => {
  name.value = ''
  phone.value = ''
  requestType.value = props.content.form.options[0]?.value ?? ''
  details.value = ''
  agree.value = false
  website.value = ''
  fieldErrors.value = {}
  captchaWidget.value?.reset()
}

const handleCaptchaStatus = (status: CaptchaClientState) => {
  captchaState.value = status

  if (status !== 'ready' && fieldErrors.value.captcha) {
    const { captcha: _captcha, ...remainingErrors } = fieldErrors.value
    fieldErrors.value = remainingErrors
  }
}

const handleSubmit = async () => {
  feedback.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        name: name.value,
        phone: normalizeRussianPhone(phone.value) ?? phone.value,
        requestType: requestType.value,
        details: details.value,
        agree: agree.value,
        captchaToken: captchaToken.value,
        captchaClientState: captchaState.value,
        locale: captchaLocale.value,
        pageUrl: window.location.href,
        website: website.value
      }
    })

    resetForm()
    feedback.value = {
      type: 'success',
      message: t('landing.contact.form.feedback.success')
    }
  } catch (error) {
    captchaWidget.value?.reset()
    feedback.value = {
      type: 'error',
      message: getSubmissionErrorMessage(error)
    }
  } finally {
    isSubmitting.value = false
  }
}

watch(name, (currentName) => {
  if (currentName.length > 30) {
    name.value = currentName.slice(0, 30)
  }
})

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

        <CardContent>
          <form
            class="relative space-y-4"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div
              class="pointer-events-none absolute -left-[10000px] top-auto size-px overflow-hidden"
              aria-hidden="true"
            >
              <Label for="landing-website">Website</Label>
              <Input
                id="landing-website"
                v-model="website"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="landing-name">
                  {{ content.form.nameLabel }}
                </Label>
                <Input
                  id="landing-name"
                  v-model="name"
                  name="name"
                  autocomplete="name"
                  maxlength="30"
                  required
                  :aria-invalid="Boolean(fieldErrors.name)"
                  :aria-describedby="fieldErrors.name ? 'landing-name-error' : undefined"
                  :placeholder="content.form.namePlaceholder"
                />
                <p
                  v-if="fieldErrors.name"
                  id="landing-name-error"
                  class="text-xs text-destructive"
                >
                  {{ fieldErrors.name }}
                </p>
              </div>

              <div class="space-y-2">
                <Label for="landing-phone">
                  {{ content.form.phoneLabel }}
                </Label>
                <Input
                  id="landing-phone"
                  v-model="phone"
                  v-maska="phoneMaskOptions"
                  name="phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  maxlength="18"
                  required
                  :aria-invalid="Boolean(fieldErrors.phone)"
                  :aria-describedby="fieldErrors.phone ? 'landing-phone-error' : undefined"
                  :placeholder="content.form.phonePlaceholder"
                />
                <p
                  v-if="fieldErrors.phone"
                  id="landing-phone-error"
                  class="text-xs text-destructive"
                >
                  {{ fieldErrors.phone }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="landing-request-type">
                {{ content.form.requestTypeLabel }}
              </Label>
              <Select v-model="requestType">
                <SelectTrigger
                  id="landing-request-type"
                  :aria-invalid="Boolean(fieldErrors.requestType)"
                  :aria-describedby="fieldErrors.requestType ? 'landing-request-type-error' : undefined"
                >
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
              <p
                v-if="fieldErrors.requestType"
                id="landing-request-type-error"
                class="text-xs text-destructive"
              >
                {{ fieldErrors.requestType }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="landing-details">
                {{ content.form.detailsLabel }}
              </Label>
              <Textarea
                id="landing-details"
                v-model="details"
                name="details"
                class="min-h-24"
                maxlength="2000"
                :placeholder="content.form.detailsPlaceholder"
              />
            </div>

            <div class="space-y-2">
              <Label class="gap-3 rounded-lg border border-border/75 bg-background/90 p-3 text-sm text-muted-foreground">
                <Checkbox
                  v-model="agree"
                  :aria-invalid="Boolean(fieldErrors.agreement)"
                />
                {{ content.form.agreementLabel }}
              </Label>
              <p
                v-if="fieldErrors.agreement"
                class="text-xs text-destructive"
              >
                {{ fieldErrors.agreement }}
              </p>
            </div>

            <div class="space-y-2">
              <YandexSmartCaptcha
                v-if="smartCaptchaSiteKey"
                ref="captchaWidget"
                v-model="captchaToken"
                :site-key="smartCaptchaSiteKey"
                :locale="captchaLocale"
                :loading-label="t('landing.contact.form.feedback.captchaLoading')"
                @update:status="handleCaptchaStatus"
              />
              <p
                v-if="fieldErrors.captcha && captchaState === 'ready'"
                class="text-xs text-destructive"
              >
                {{ fieldErrors.captcha }}
              </p>
            </div>

            <p
              v-if="feedback"
              id="landing-form-feedback"
              class="rounded-lg border px-3 py-2 text-sm"
              :class="feedback.type === 'success'
                ? 'border-primary/30 bg-primary/10 text-foreground'
                : 'border-destructive/30 bg-destructive/10 text-destructive'"
              :role="feedback.type === 'error' ? 'alert' : 'status'"
              aria-live="polite"
            >
              {{ feedback.message }}
            </p>

            <Button
              type="submit"
              class="w-full"
              size="lg"
              :disabled="isSubmitDisabled"
              aria-describedby="landing-form-feedback"
            >
              <LoaderCircle
                v-if="isSubmitting"
                class="size-4 animate-spin"
              />
              {{ isSubmitting
                ? t('landing.contact.form.feedback.submitting')
                : content.form.submitLabel }}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
