import {
  createError,
  defineEventHandler,
  getHeader,
  getRequestHost,
  getRequestIP,
  readBody
} from 'h3'
import { z } from 'zod'

const SMARTCAPTCHA_VALIDATE_URL =
  'https://smartcaptcha.cloud.yandex.ru/validate'
const MAX_REQUEST_BYTES = 20_000

interface RateLimitBucket {
  count: number
  resetAt: number
}

interface SmartCaptchaResponse {
  status?: string
  message?: string
  host?: string
}

type CaptchaClientState = 'loading' | 'ready' | 'passed' | 'unavailable'
type CaptchaStatus = 'passed' | 'skipped' | 'failed' | 'unavailable'

interface LeadData {
  name: string
  phone: string
  requestType: string
  details?: string
  formLocale: 'ru' | 'en'
  pageUrl: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  consent: true
  consentAt: string
  captchaStatus: CaptchaStatus
  source: 'website'
  status: 'new'
}

const rateLimitBuckets = new Map<string, RateLimitBucket>()

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

const leadSchema = z
  .object({
    name: z.string().trim().min(2).max(30),
    phone: z
      .string()
      .trim()
      .max(32)
      .refine((value) => normalizeRussianPhone(value) !== null)
      .transform((value) => normalizeRussianPhone(value) as string),
    requestType: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[\p{L}\p{N}_-]+$/u),
    details: z.string().trim().max(2000).optional().default(''),
    agree: z.literal(true),
    captchaToken: z.string().trim().max(8192).optional().default(''),
    captchaClientState: z
      .enum(['loading', 'ready', 'passed', 'unavailable'])
      .optional()
      .default('unavailable'),
    locale: z.enum(['ru', 'en']),
    pageUrl: z
      .string()
      .trim()
      .max(2048)
      .url()
      .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol)),
    website: z.string().max(200).optional().default('')
  })
  .strict()

const requestError = (
  statusCode: number,
  code: string,
  statusMessage: string
) =>
  createError({
    statusCode,
    statusMessage,
    data: { code }
  })

const clampNumber = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number
) => {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  return Math.min(Math.max(Math.floor(numericValue), minimum), maximum)
}

const enforceRateLimit = (
  clientIp: string,
  maxRequests: number,
  windowMs: number
) => {
  const now = Date.now()

  if (rateLimitBuckets.size > 5000) {
    for (const [key, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) {
        rateLimitBuckets.delete(key)
      }
    }
  }

  const bucket = rateLimitBuckets.get(clientIp)

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientIp, {
      count: 1,
      resetAt: now + windowMs
    })
    return
  }

  if (bucket.count >= maxRequests) {
    throw requestError(429, 'RATE_LIMITED', 'Too many requests')
  }

  bucket.count += 1
}

const fetchWithTimeout = async (
  input: string | URL,
  init: RequestInit,
  timeoutMs: number
) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    })
  } finally {
    clearTimeout(timeout)
  }
}

const normalizeHost = (value: string) => value.trim().toLowerCase()

const validateSmartCaptcha = async (
  token: string,
  clientIp: string,
  serverKey: string,
  allowedHosts: Set<string>,
  clientState: CaptchaClientState
): Promise<CaptchaStatus> => {
  if (!token) {
    return clientState === 'ready' ? 'skipped' : 'unavailable'
  }

  if (!serverKey) {
    return 'unavailable'
  }

  const body = new URLSearchParams({
    secret: serverKey,
    token,
    ip: clientIp
  })

  let response: Response

  try {
    response = await fetchWithTimeout(
      SMARTCAPTCHA_VALIDATE_URL,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body
      },
      3500
    )
  } catch {
    console.warn('[leads] SmartCaptcha is unavailable; accepting the lead')
    return 'unavailable'
  }

  if (!response.ok) {
    console.warn(
      `[leads] SmartCaptcha returned ${response.status}; accepting the lead`
    )
    return 'unavailable'
  }

  let result: SmartCaptchaResponse

  try {
    result = (await response.json()) as SmartCaptchaResponse
  } catch {
    console.warn('[leads] SmartCaptcha returned invalid JSON; accepting the lead')
    return 'unavailable'
  }

  if (result.status !== 'ok') {
    console.warn('[leads] SmartCaptcha validation failed; accepting the lead')
    return 'failed'
  }

  const captchaHost = normalizeHost(result.host ?? '')

  if (!captchaHost) {
    console.warn('[leads] SmartCaptcha returned no host; accepting the lead')
    return 'unavailable'
  }

  if (!allowedHosts.has(captchaHost)) {
    console.warn('[leads] SmartCaptcha host mismatch; accepting the lead')
    return 'failed'
  }

  return 'passed'
}

const getOptionalQueryValue = (url: URL, key: string) => {
  const value = url.searchParams.get(key)?.trim()
  return value ? value.slice(0, 255) : undefined
}

const createLeadData = (
  payload: z.infer<typeof leadSchema>,
  consentAt: string,
  captchaStatus: CaptchaStatus
): LeadData => {
  const pageUrl = new URL(payload.pageUrl)

  return {
    name: payload.name,
    phone: payload.phone,
    requestType: payload.requestType,
    details: payload.details || undefined,
    formLocale: payload.locale,
    pageUrl: pageUrl.toString(),
    utmSource: getOptionalQueryValue(pageUrl, 'utm_source'),
    utmMedium: getOptionalQueryValue(pageUrl, 'utm_medium'),
    utmCampaign: getOptionalQueryValue(pageUrl, 'utm_campaign'),
    utmContent: getOptionalQueryValue(pageUrl, 'utm_content'),
    utmTerm: getOptionalQueryValue(pageUrl, 'utm_term'),
    consent: true,
    consentAt,
    captchaStatus,
    source: 'website',
    status: 'new'
  }
}

const saveLead = async (
  strapiUrl: string,
  apiToken: string,
  lead: LeadData
) => {
  let response: Response

  try {
    response = await fetchWithTimeout(
      new URL('/api/leads', strapiUrl),
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiToken}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ data: lead })
      },
      5000
    )
  } catch {
    throw requestError(
      503,
      'LEAD_STORAGE_UNAVAILABLE',
      'Lead storage is unavailable'
    )
  }

  if (!response.ok) {
    console.error(`[leads] Strapi rejected lead creation with ${response.status}`)
    throw requestError(
      503,
      'LEAD_STORAGE_UNAVAILABLE',
      'Lead storage is unavailable'
    )
  }
}

const notifyTelegram = async (
  botToken: string,
  chatId: string,
  lead: LeadData
) => {
  if (!botToken || !chatId) {
    return
  }

  const text = [
    'Новая заявка с сайта',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Тип: ${lead.requestType}`,
    lead.details ? `Комментарий: ${lead.details.slice(0, 1000)}` : '',
    `Страница: ${lead.pageUrl}`
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const response = await fetchWithTimeout(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      },
      3000
    )

    if (!response.ok) {
      console.warn(
        `[leads] Telegram notification failed with ${response.status}`
      )
    }
  } catch {
    console.warn('[leads] Telegram notification failed')
  }
}

export default defineEventHandler(async (event) => {
  const contentLength = Number(getHeader(event, 'content-length') || 0)

  if (contentLength > MAX_REQUEST_BYTES) {
    throw requestError(413, 'PAYLOAD_TOO_LARGE', 'Payload is too large')
  }

  const contentType = getHeader(event, 'content-type') || ''

  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw requestError(415, 'UNSUPPORTED_MEDIA_TYPE', 'JSON body is required')
  }

  const config = useRuntimeConfig(event)
  const maxRequests = clampNumber(config.leadRateLimitMax, 5, 1, 100)
  const windowMs = clampNumber(
    config.leadRateLimitWindowMs,
    600_000,
    1000,
    3_600_000
  )
  const clientIp =
    getRequestIP(event, { xForwardedFor: true })?.split(',')[0]?.trim() ||
    'unknown'

  enforceRateLimit(clientIp, maxRequests, windowMs)

  const body = await readBody<unknown>(event)

  if (
    body &&
    typeof body === 'object' &&
    'website' in body &&
    typeof body.website === 'string' &&
    body.website.trim()
  ) {
    return { ok: true }
  }

  const parsed = leadSchema.safeParse(body)

  if (!parsed.success) {
    throw requestError(422, 'VALIDATION_ERROR', 'Invalid form data')
  }

  const smartCaptchaServerKey = String(config.smartCaptchaServerKey || '').trim()
  const strapiApiToken = String(config.strapiApiToken || '').trim()

  if (!strapiApiToken) {
    throw requestError(
      503,
      'FORM_NOT_CONFIGURED',
      'Lead form is not configured'
    )
  }

  const allowedHosts = new Set<string>([
    normalizeHost(getRequestHost(event, { xForwardedHost: true }))
  ])

  try {
    allowedHosts.add(normalizeHost(new URL(config.public.siteUrl).host))
  } catch {
    // The current request host still protects validation if siteUrl is invalid.
  }

  if (!allowedHosts.has(normalizeHost(new URL(parsed.data.pageUrl).host))) {
    throw requestError(422, 'VALIDATION_ERROR', 'Invalid form page URL')
  }

  const captchaStatus = await validateSmartCaptcha(
    parsed.data.captchaToken,
    clientIp,
    smartCaptchaServerKey,
    allowedHosts,
    parsed.data.captchaClientState
  )

  const lead = createLeadData(
    parsed.data,
    new Date().toISOString(),
    captchaStatus
  )

  await saveLead(String(config.strapiUrl), strapiApiToken, lead)
  await notifyTelegram(
    String(config.telegramBotToken || '').trim(),
    String(config.telegramChatId || '').trim(),
    lead
  )

  return { ok: true, captchaStatus }
})
