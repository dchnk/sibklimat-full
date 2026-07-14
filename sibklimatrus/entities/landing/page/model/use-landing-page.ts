import { computed } from 'vue'
import { useAsyncData, useI18n, useRuntimeConfig } from '#imports'
import { createLandingPageFallback } from './fallback'
import { mapStrapiLandingPage } from './strapi'
import { landingPagePopulateQuery } from './strapi-query'

interface LandingPageFetchResult {
  payload: unknown | null
}

const resolveStrapiLocale = (locale: string) =>
  locale === 'ru' ? 'ru-RU' : locale

export const useLandingPage = () => {
  const config = useRuntimeConfig()
  const { locale, t } = useI18n()
  const fallback = computed(() => createLandingPageFallback((key) => t(key)))
  const requestStrapiUrl = String(
    import.meta.server ? config.strapiUrl : config.public.strapiUrl
  ).replace(/\/+$/, '')
  const publicStrapiUrl = String(config.public.strapiUrl).replace(/\/+$/, '')

  const { data, pending, refresh } = useAsyncData<LandingPageFetchResult>(
    'landing:page',
    async () => {
      try {
        const payload = await $fetch<unknown>(`${requestStrapiUrl}/api/homepage`, {
          query: {
            locale: resolveStrapiLocale(locale.value),
            ...landingPagePopulateQuery
          },
          timeout: 8000
        })

        return { payload }
      } catch {
        return { payload: null }
      }
    },
    {
      watch: [locale],
      default: () => ({ payload: null })
    }
  )

  const content = computed(() =>
    mapStrapiLandingPage(
      data.value?.payload,
      fallback.value,
      publicStrapiUrl
    )
  )

  return {
    content,
    pending,
    refresh
  }
}
