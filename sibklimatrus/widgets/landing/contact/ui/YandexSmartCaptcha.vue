<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type SmartCaptchaLanguage = 'ru' | 'en'
type SmartCaptchaEvent =
  | 'network-error'
  | 'javascript-error'
  | 'token-expired'

interface SmartCaptchaApi {
  render: (
    container: HTMLElement,
    params: {
      sitekey: string
      hl: SmartCaptchaLanguage
      callback: (token: string) => void
    }
  ) => number
  reset: (widgetId?: number) => void
  destroy: (widgetId?: number) => void
  subscribe: (
    widgetId: number,
    event: SmartCaptchaEvent,
    callback: () => void
  ) => () => void
}

type SmartCaptchaWindow = Window & {
  smartCaptcha?: SmartCaptchaApi
  __sibklimatSmartCaptchaReady?: () => void
}

const props = defineProps<{
  siteKey: string
  locale: SmartCaptchaLanguage
  loadingLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:status': [value: 'loading' | 'ready' | 'passed' | 'unavailable']
}>()

const SCRIPT_ID = 'sibklimat-yandex-smartcaptcha'
const CALLBACK_NAME = '__sibklimatSmartCaptchaReady'
const SCRIPT_URL =
  `https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload&onload=${CALLBACK_NAME}`

const container = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isUnavailable = ref(false)
const currentToken = ref('')

let isMounted = false
let widgetId: number | undefined
let smartCaptchaApi: SmartCaptchaApi | undefined
let unsubscribers: Array<() => void> = []

const clearToken = () => {
  currentToken.value = ''
  emit('update:modelValue', '')
}

const cleanupWidget = () => {
  for (const unsubscribe of unsubscribers) {
    unsubscribe()
  }

  unsubscribers = []

  if (smartCaptchaApi && widgetId !== undefined) {
    smartCaptchaApi.destroy(widgetId)
  }

  widgetId = undefined
}

const loadSmartCaptcha = () => {
  const captchaWindow = window as SmartCaptchaWindow

  if (captchaWindow.smartCaptcha) {
    return Promise.resolve(captchaWindow.smartCaptcha)
  }

  return new Promise<SmartCaptchaApi>((resolve, reject) => {
    let settled = false
    const timeout = window.setTimeout(() => {
      finish(new Error('SmartCaptcha loading timed out'))
    }, 5000)

    const finish = (error?: Error) => {
      if (settled) {
        return
      }

      settled = true
      window.clearTimeout(timeout)

      if (error || !captchaWindow.smartCaptcha) {
        reject(error ?? new Error('SmartCaptcha API is unavailable'))
        return
      }

      resolve(captchaWindow.smartCaptcha)
    }

    captchaWindow.__sibklimatSmartCaptchaReady = () => finish()

    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => finish(), { once: true })
      existingScript.addEventListener(
        'error',
        () => finish(new Error('SmartCaptcha script failed to load')),
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_URL
    script.async = true
    script.defer = true
    script.addEventListener('load', () => finish(), { once: true })
    script.addEventListener(
      'error',
      () => finish(new Error('SmartCaptcha script failed to load')),
      { once: true }
    )
    document.head.append(script)
  })
}

const hideUnavailableWidget = () => {
  isLoading.value = false
  isUnavailable.value = true
  clearToken()
  emit('update:status', 'unavailable')
  cleanupWidget()
}

const renderWidget = async () => {
  cleanupWidget()
  clearToken()
  isUnavailable.value = false
  isLoading.value = true
  emit('update:status', 'loading')

  if (!props.siteKey) {
    hideUnavailableWidget()
    return
  }

  await nextTick()

  if (!container.value) {
    hideUnavailableWidget()
    return
  }

  try {
    smartCaptchaApi = await loadSmartCaptcha()

    if (!isMounted || !container.value) {
      return
    }

    widgetId = smartCaptchaApi.render(container.value, {
      sitekey: props.siteKey,
      hl: props.locale,
      callback: (token) => {
        currentToken.value = token
        emit('update:modelValue', token)
        emit('update:status', token ? 'passed' : 'ready')
      }
    })

    const handleTokenExpired = () => {
      clearToken()
      emit('update:status', 'ready')
    }
    const handleWidgetError = () => hideUnavailableWidget()

    unsubscribers = [
      smartCaptchaApi.subscribe(
        widgetId,
        'token-expired',
        handleTokenExpired
      ),
      smartCaptchaApi.subscribe(widgetId, 'network-error', handleWidgetError),
      smartCaptchaApi.subscribe(widgetId, 'javascript-error', handleWidgetError)
    ]

    isLoading.value = false
    if (!currentToken.value) {
      emit('update:status', 'ready')
    }
  } catch {
    hideUnavailableWidget()
  }
}

const reset = () => {
  clearToken()

  if (smartCaptchaApi && widgetId !== undefined) {
    smartCaptchaApi.reset(widgetId)
    emit('update:status', 'ready')
  }
}

defineExpose({ reset })

onMounted(() => {
  isMounted = true
  void renderWidget()
})

watch(
  () => [props.locale, props.siteKey],
  () => {
    if (isMounted) {
      void renderWidget()
    }
  }
)

onBeforeUnmount(() => {
  isMounted = false
  cleanupWidget()
})
</script>

<template>
  <div
    v-if="!isUnavailable"
    class="relative min-h-[100px] overflow-hidden rounded-lg border border-border/75 bg-background/90"
  >
    <div
      ref="container"
      class="min-h-[100px] transition-opacity"
      :class="{ 'opacity-0': isLoading }"
    />
    <p
      v-if="isLoading"
      class="absolute inset-0 grid place-items-center px-4 text-center text-sm text-muted-foreground"
    >
      {{ loadingLabel }}
    </p>
  </div>
</template>
