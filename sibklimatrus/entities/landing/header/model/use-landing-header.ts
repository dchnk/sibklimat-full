import { computed } from 'vue'
import { useAsyncData, useI18n, useRuntimeConfig } from '#imports'
import { landingHeaderContent } from './content'
import {
  isValidStrapiHeader,
  mapStrapiHeaderToDomain
} from './strapi'
import type { LandingHeaderContent } from './types'

interface StrapiSingleTypeV5<T> {
  data?: T | null
}

interface StrapiSingleTypeV4<T> {
  data?: {
    attributes?: T | null
  } | null
}

interface StrapiHomepagePayload {
  header?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractHeaderFromResponse = (
  payload: StrapiSingleTypeV5<StrapiHomepagePayload> | StrapiSingleTypeV4<StrapiHomepagePayload>
): unknown => {
  const data = payload.data
  if (!data || !isRecord(data)) {
    return null
  }

  if ('header' in data) {
    return data.header
  }

  if ('attributes' in data && isRecord(data.attributes) && 'header' in data.attributes) {
    return data.attributes.header
  }

  return null
}

export const useLandingHeader = () => {
  const config = useRuntimeConfig()
  const { locale } = useI18n()

  const { data, pending, refresh } = useAsyncData<LandingHeaderContent>(
    'landing:header',
    async () => {
      try {
        const response = await $fetch<
          StrapiSingleTypeV5<StrapiHomepagePayload> | StrapiSingleTypeV4<StrapiHomepagePayload>
        >(`${config.public.strapiUrl}/api/homepage`, {
          query: {
            locale: locale.value,
            'populate[header][populate][navigation]': '*'
          }
        })

        const rawHeader = extractHeaderFromResponse(response)
        if (!isValidStrapiHeader(rawHeader)) {
          return landingHeaderContent
        }

        return mapStrapiHeaderToDomain(rawHeader)
      } catch {
        return landingHeaderContent
      }
    },
    {
      watch: [locale],
      default: () => landingHeaderContent
    }
  )

  return {
    content: computed(() => data.value ?? landingHeaderContent),
    pending,
    refresh
  }
}
