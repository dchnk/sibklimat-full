import type { LandingHeaderContent, LandingHeaderNavigationItem } from './types'
import { rawText } from './text'

export interface StrapiLandingHeaderNavigationItem {
  id?: number | string
  href: string
  label: string
}

export interface StrapiLandingHeaderContent {
  brand: string
  tagline: string
  navigation: StrapiLandingHeaderNavigationItem[]
  ctaLabel: string
  ctaHref: string
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isNavigationItem = (value: unknown): value is StrapiLandingHeaderNavigationItem => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<StrapiLandingHeaderNavigationItem>
  return isNonEmptyString(candidate.label) && isNonEmptyString(candidate.href)
}

export const isValidStrapiHeader = (value: unknown): value is StrapiLandingHeaderContent => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<StrapiLandingHeaderContent>

  return (
    isNonEmptyString(candidate.brand) &&
    isNonEmptyString(candidate.tagline) &&
    isNonEmptyString(candidate.ctaLabel) &&
    isNonEmptyString(candidate.ctaHref) &&
    Array.isArray(candidate.navigation) &&
    candidate.navigation.every(isNavigationItem)
  )
}

const mapStrapiNavigation = (
  items: StrapiLandingHeaderNavigationItem[]
): LandingHeaderNavigationItem[] =>
  items.map((item, index) => ({
    id: String(item.id ?? index + 1),
    href: item.href,
    label: rawText(item.label)
  }))

export const mapStrapiHeaderToDomain = (
  payload: StrapiLandingHeaderContent
): LandingHeaderContent => ({
  brand: rawText(payload.brand),
  tagline: rawText(payload.tagline),
  navigation: mapStrapiNavigation(payload.navigation),
  cta: {
    href: payload.ctaHref,
    label: rawText(payload.ctaLabel)
  }
})
