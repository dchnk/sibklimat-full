import type {
  LandingContactChannel,
  LandingContactChannelType,
  LandingContactContent,
  LandingContactFormContent,
  LandingFaqContent,
  LandingFaqItem,
  LandingFooterContent,
  LandingHeaderContent,
  LandingHeroContent,
  LandingMedia,
  LandingMetric,
  LandingNavigationItem,
  LandingPageContent,
  LandingProcessContent,
  LandingProcessStep,
  LandingRequestOption,
  LandingSeoContent,
  LandingServiceIconKey,
  LandingServiceItem,
  LandingServicesContent,
  LandingSolutionCard,
  LandingSolutionsContent,
  LandingSolutionTab,
  LandingTextItem
} from './types'

type UnknownRecord = Record<string, unknown>

const serviceIconKeys = new Set<LandingServiceIconKey>([
  'home',
  'building',
  'factory',
  'wind',
  'wrench',
  'settings'
])

const contactChannelTypes = new Set<LandingContactChannelType>([
  'phone',
  'email',
  'location',
  'other'
])

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const unwrapAttributes = (value: unknown): UnknownRecord | null => {
  if (!isRecord(value)) {
    return null
  }

  return isRecord(value.attributes) ? value.attributes : value
}

const unwrapRelation = (value: unknown): UnknownRecord | null => {
  if (!isRecord(value)) {
    return null
  }

  if ('data' in value) {
    return unwrapAttributes(value.data)
  }

  return unwrapAttributes(value)
}

const getRequiredString = (record: UnknownRecord, key: string): string | null => {
  const value = record[key]
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null
  }

  return value.trim()
}

const getOptionalString = (record: UnknownRecord, key: string): string | undefined => {
  const value = record[key]
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  return value.trim()
}

const getRequiredBoolean = (record: UnknownRecord, key: string): boolean | null =>
  typeof record[key] === 'boolean' ? record[key] : null

const getPositiveNumber = (record: UnknownRecord, key: string): number | undefined => {
  const value = record[key]
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : undefined
}

const getComponentRecords = (value: unknown): UnknownRecord[] | null => {
  let source = value

  if (isRecord(source) && 'data' in source) {
    source = source.data
  }

  if (!Array.isArray(source) || source.length === 0) {
    return null
  }

  const records = source.map(unwrapAttributes)
  return records.every((record): record is UnknownRecord => record !== null)
    ? records
    : null
}

const getDomainId = (record: UnknownRecord, prefix: string, index: number): string => {
  const rawId = record.documentId ?? record.id ?? record.slug ?? index + 1
  const id = typeof rawId === 'string' || typeof rawId === 'number'
    ? String(rawId)
    : String(index + 1)

  return `${prefix}-${id}-${index}`
}

const getSafeHref = (record: UnknownRecord, key: string): string | null => {
  const href = getRequiredString(record, key)
  if (!href) {
    return null
  }

  return /^(?:#[^\s]*|\/(?!\/)[^\s]*|https?:\/\/[^\s]+|tel:[^\s]+|mailto:[^\s]+)$/i.test(href)
    ? href
    : null
}

export const normalizeStrapiMediaUrl = (url: string, publicStrapiUrl: string): string => {
  const normalizedUrl = url.trim()
  if (/^[a-z][a-z\d+.-]*:/i.test(normalizedUrl)) {
    return normalizedUrl
  }

  if (normalizedUrl.startsWith('//')) {
    const protocol = publicStrapiUrl.match(/^([a-z][a-z\d+.-]*:)/i)?.[1] ?? 'https:'
    return `${protocol}${normalizedUrl}`
  }

  const base = publicStrapiUrl.trim().replace(/\/+$/, '')
  return base.length > 0
    ? `${base}/${normalizedUrl.replace(/^\/+/, '')}`
    : normalizedUrl
}

const mapMedia = (
  value: unknown,
  explicitAlt: string | undefined,
  publicStrapiUrl: string
): LandingMedia | null => {
  const media = unwrapRelation(value)
  if (!media) {
    return null
  }

  const url = getRequiredString(media, 'url')
  if (!url) {
    return null
  }

  return {
    url: normalizeStrapiMediaUrl(url, publicStrapiUrl),
    alternativeText: explicitAlt ?? getOptionalString(media, 'alternativeText'),
    caption: getOptionalString(media, 'caption'),
    name: getOptionalString(media, 'name'),
    mime: getOptionalString(media, 'mime'),
    width: getPositiveNumber(media, 'width'),
    height: getPositiveNumber(media, 'height')
  }
}

const mapRequiredList = <T>(
  value: unknown,
  mapper: (record: UnknownRecord, index: number) => T | null
): T[] | null => {
  const records = getComponentRecords(value)
  if (!records) {
    return null
  }

  const mapped = records.map(mapper)
  return mapped.every((item): item is T => item !== null) ? mapped : null
}

const mapTextItem = (
  record: UnknownRecord,
  index: number,
  prefix: string
): LandingTextItem | null => {
  const text = getRequiredString(record, 'text')
  return text
    ? { id: getDomainId(record, prefix, index), text }
    : null
}

const mapMetric = (
  record: UnknownRecord,
  index: number,
  prefix: string
): LandingMetric | null => {
  const value = getRequiredString(record, 'value')
  const label = getRequiredString(record, 'label')
  return value && label
    ? { id: getDomainId(record, prefix, index), value, label }
    : null
}

const mapSeo = (value: unknown, publicStrapiUrl: string): LandingSeoContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const metaTitle = getRequiredString(record, 'metaTitle')
  const metaDescription = getRequiredString(record, 'metaDescription')
  const shareImageAlt = getRequiredString(record, 'shareImageAlt')
  const shareImage = record.shareImage
    ? mapMedia(record.shareImage, shareImageAlt ?? undefined, publicStrapiUrl) ?? undefined
    : undefined

  return metaTitle && metaDescription && shareImageAlt && (!record.shareImage || shareImage)
    ? { metaTitle, metaDescription, shareImage }
    : null
}

const mapNavigationItem = (
  record: UnknownRecord,
  index: number
): LandingNavigationItem | null => {
  const label = getRequiredString(record, 'label')
  const href = getSafeHref(record, 'href')
  return label && href
    ? { id: getDomainId(record, 'navigation', index), label, href }
    : null
}

const mapHeader = (value: unknown, publicStrapiUrl: string): LandingHeaderContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const brand = getRequiredString(record, 'brand')
  const brandHref = getSafeHref(record, 'brandHref')
  const tagline = getRequiredString(record, 'tagline')
  const navigation = mapRequiredList(record.navigation, mapNavigationItem)
  const ctaLabel = getRequiredString(record, 'ctaLabel')
  const ctaHref = getSafeHref(record, 'ctaHref')
  const logoAlt = getOptionalString(record, 'logoAlt')
  const logo = record.logo
    ? mapMedia(record.logo, logoAlt, publicStrapiUrl) ?? undefined
    : undefined

  return brand && brandHref && tagline && navigation && ctaLabel && ctaHref
    ? { logo, brand, brandHref, tagline, navigation, ctaLabel, ctaHref }
    : null
}

const mapHero = (value: unknown, publicStrapiUrl: string): LandingHeroContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const primaryCtaLabel = getRequiredString(record, 'primaryCtaLabel')
  const primaryCtaHref = getSafeHref(record, 'primaryCtaHref')
  const secondaryCtaLabel = getRequiredString(record, 'secondaryCtaLabel')
  const kpis = mapRequiredList(record.kpis, (item, index) =>
    mapMetric(item, index, 'hero-kpi'))
  const quickDialogTitle = getRequiredString(record, 'quickDialogTitle')
  const quickDialogDescription = getRequiredString(record, 'quickDialogDescription')
  const quickDialogItems = mapRequiredList(record.quickDialogItems, (item, index) =>
    mapTextItem(item, index, 'hero-dialog'))
  const panelTitle = getRequiredString(record, 'panelTitle')
  const panelDescription = getRequiredString(record, 'panelDescription')
  const panelImageAlt = getRequiredString(record, 'panelImageAlt')
  const panelImage = record.panelImage
    ? mapMedia(record.panelImage, panelImageAlt ?? undefined, publicStrapiUrl) ?? undefined
    : undefined
  const panelPlaceholderTitle = getRequiredString(record, 'panelPlaceholderTitle')
  const panelPlaceholderDescription = getRequiredString(
    record,
    'panelPlaceholderDescription'
  )
  const panelPoints = mapRequiredList(record.panelPoints, (item, index) =>
    mapTextItem(item, index, 'hero-panel'))

  if (
    !badge || !title || !subtitle || !primaryCtaLabel || !primaryCtaHref ||
    !secondaryCtaLabel || !kpis || !quickDialogTitle || !quickDialogDescription ||
    !quickDialogItems || !panelTitle || !panelDescription || !panelImageAlt ||
    (record.panelImage && !panelImage) || !panelPlaceholderTitle ||
    !panelPlaceholderDescription || !panelPoints
  ) {
    return null
  }

  return {
    badge,
    title,
    subtitle,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    kpis,
    quickDialogTitle,
    quickDialogDescription,
    quickDialogItems,
    panelTitle,
    panelDescription,
    panelImage,
    panelPlaceholderTitle,
    panelPlaceholderDescription,
    panelPoints
  }
}

const mapServiceItem = (
  record: UnknownRecord,
  index: number,
  publicStrapiUrl: string
): LandingServiceItem | null => {
  const slug = getRequiredString(record, 'slug')
  const rawIconKey = getRequiredString(record, 'iconKey')
  const iconKey = rawIconKey && serviceIconKeys.has(rawIconKey as LandingServiceIconKey)
    ? rawIconKey as LandingServiceIconKey
    : null
  const chip = getRequiredString(record, 'chip')
  const title = getRequiredString(record, 'title')
  const description = getRequiredString(record, 'description')
  const imageAlt = getRequiredString(record, 'imageAlt')
  const image = record.image
    ? mapMedia(record.image, imageAlt ?? undefined, publicStrapiUrl) ?? undefined
    : undefined
  const points = mapRequiredList(record.points, (item, pointIndex) =>
    mapTextItem(item, pointIndex, `service-${index}-point`))

  return slug && iconKey && chip && title && description && imageAlt &&
    (!record.image || image) && points
    ? {
        id: getDomainId(record, 'service', index),
        slug,
        iconKey,
        chip,
        title,
        description,
        image,
        points
      }
    : null
}

const mapServices = (
  value: unknown,
  publicStrapiUrl: string
): LandingServicesContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const mediaPlaceholder = getRequiredString(record, 'mediaPlaceholder')
  const items = mapRequiredList(record.items, (item, index) =>
    mapServiceItem(item, index, publicStrapiUrl))

  return badge && title && subtitle && mediaPlaceholder && items
    ? { badge, title, subtitle, mediaPlaceholder, items }
    : null
}

const mapSolutionCard = (
  record: UnknownRecord,
  index: number,
  tabIndex: number,
  publicStrapiUrl: string
): LandingSolutionCard | null => {
  const slug = getRequiredString(record, 'slug')
  const title = getRequiredString(record, 'title')
  const description = getRequiredString(record, 'description')
  const imageAlt = getRequiredString(record, 'imageAlt')
  const image = record.image
    ? mapMedia(record.image, imageAlt ?? undefined, publicStrapiUrl) ?? undefined
    : undefined
  const points = mapRequiredList(record.points, (item, pointIndex) =>
    mapTextItem(item, pointIndex, `solution-${tabIndex}-${index}-point`))

  return slug && title && description && imageAlt && (!record.image || image) && points
    ? {
        id: getDomainId(record, `solution-${tabIndex}`, index),
        slug,
        title,
        description,
        image,
        points
      }
    : null
}

const mapSolutionTab = (
  record: UnknownRecord,
  index: number,
  publicStrapiUrl: string
): LandingSolutionTab | null => {
  const slug = getRequiredString(record, 'slug')
  const label = getRequiredString(record, 'label')
  const cards = mapRequiredList(record.cards, (card, cardIndex) =>
    mapSolutionCard(card, cardIndex, index, publicStrapiUrl))

  if (!slug || !label || !cards) {
    return null
  }

  const id = getDomainId(record, 'solution-tab', index)
  return { id, slug, label, cards }
}

const mapSolutions = (
  value: unknown,
  publicStrapiUrl: string
): LandingSolutionsContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const mediaPlaceholder = getRequiredString(record, 'mediaPlaceholder')
  const tabs = mapRequiredList(record.tabs, (tab, index) =>
    mapSolutionTab(tab, index, publicStrapiUrl))

  return badge && title && subtitle && mediaPlaceholder && tabs
    ? { badge, title, subtitle, mediaPlaceholder, tabs }
    : null
}

const mapProcessStep = (
  record: UnknownRecord,
  index: number
): LandingProcessStep | null => {
  const slug = getRequiredString(record, 'slug')
  const title = getRequiredString(record, 'title')
  const description = getRequiredString(record, 'description')

  return slug && title && description
    ? { id: getDomainId(record, 'process-step', index), slug, title, description }
    : null
}

const mapProcess = (value: unknown): LandingProcessContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const steps = mapRequiredList(record.steps, mapProcessStep)
  const metrics = mapRequiredList(record.metrics, (metric, index) =>
    mapMetric(metric, index, 'process-metric'))

  return badge && title && subtitle && steps && metrics
    ? { badge, title, subtitle, steps, metrics }
    : null
}

const mapFaqItem = (record: UnknownRecord, index: number): LandingFaqItem | null => {
  const slug = getRequiredString(record, 'slug')
  const question = getRequiredString(record, 'question')
  const answer = getRequiredString(record, 'answer')

  return slug && question && answer
    ? { id: getDomainId(record, 'faq', index), slug, question, answer }
    : null
}

const mapFaq = (value: unknown): LandingFaqContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const items = mapRequiredList(record.items, mapFaqItem)

  return badge && title && subtitle && items
    ? { badge, title, subtitle, items }
    : null
}

const mapContactChannel = (
  record: UnknownRecord,
  index: number
): LandingContactChannel | null => {
  const rawType = getRequiredString(record, 'type')
  const type = rawType && contactChannelTypes.has(rawType as LandingContactChannelType)
    ? rawType as LandingContactChannelType
    : null
  const label = getRequiredString(record, 'label')
  const value = getRequiredString(record, 'value')
  const href = getSafeHref(record, 'href')
  const openInNewTab = getRequiredBoolean(record, 'openInNewTab')

  return type && label && value && href && openInNewTab !== null
    ? {
        id: getDomainId(record, 'contact-channel', index),
        type,
        label,
        value,
        href,
        openInNewTab
      }
    : null
}

const mapRequestOption = (
  record: UnknownRecord,
  index: number
): LandingRequestOption | null => {
  const value = getRequiredString(record, 'value')
  const label = getRequiredString(record, 'label')
  return value && label
    ? { id: getDomainId(record, 'request-option', index), value, label }
    : null
}

const mapContactForm = (value: unknown): LandingContactFormContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const title = getRequiredString(record, 'title')
  const description = getRequiredString(record, 'description')
  const nameLabel = getRequiredString(record, 'nameLabel')
  const namePlaceholder = getRequiredString(record, 'namePlaceholder')
  const phoneLabel = getRequiredString(record, 'phoneLabel')
  const phonePlaceholder = getRequiredString(record, 'phonePlaceholder')
  const requestTypeLabel = getRequiredString(record, 'requestTypeLabel')
  const requestTypePlaceholder = getRequiredString(record, 'requestTypePlaceholder')
  const detailsLabel = getRequiredString(record, 'detailsLabel')
  const detailsPlaceholder = getRequiredString(record, 'detailsPlaceholder')
  const options = mapRequiredList(record.options, mapRequestOption)
  const optionsAreUnique = options
    ? new Set(options.map((option) => option.value)).size === options.length
    : false
  const agreementLabel = getRequiredString(record, 'agreementLabel')
  const submitLabel = getRequiredString(record, 'submitLabel')

  if (
    !title || !description || !nameLabel || !namePlaceholder || !phoneLabel ||
    !phonePlaceholder || !requestTypeLabel || !requestTypePlaceholder ||
    !detailsLabel || !detailsPlaceholder || !options || !optionsAreUnique ||
    !agreementLabel || !submitLabel
  ) {
    return null
  }

  return {
    title,
    description,
    nameLabel,
    namePlaceholder,
    phoneLabel,
    phonePlaceholder,
    requestTypeLabel,
    requestTypePlaceholder,
    detailsLabel,
    detailsPlaceholder,
    options,
    agreementLabel,
    submitLabel
  }
}

const mapContact = (
  value: unknown,
  publicStrapiUrl: string
): LandingContactContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const badge = getRequiredString(record, 'badge')
  const title = getRequiredString(record, 'title')
  const subtitle = getRequiredString(record, 'subtitle')
  const directTitle = getRequiredString(record, 'directTitle')
  const directDescription = getRequiredString(record, 'directDescription')
  const channels = mapRequiredList(record.channels, mapContactChannel)
  const mapImageAlt = getRequiredString(record, 'mapImageAlt')
  const mapImage = record.mapImage
    ? mapMedia(record.mapImage, mapImageAlt ?? undefined, publicStrapiUrl) ?? undefined
    : undefined
  const mapPlaceholderTitle = getRequiredString(record, 'mapPlaceholderTitle')
  const mapPlaceholderDescription = getRequiredString(record, 'mapPlaceholderDescription')
  const form = mapContactForm(record.form)

  if (
    !badge || !title || !subtitle || !directTitle || !directDescription || !channels ||
    !mapImageAlt || (record.mapImage && !mapImage) || !mapPlaceholderTitle ||
    !mapPlaceholderDescription || !form
  ) {
    return null
  }

  return {
    badge,
    title,
    subtitle,
    directTitle,
    directDescription,
    channels,
    mapImage,
    mapPlaceholderTitle,
    mapPlaceholderDescription,
    form
  }
}

const mapFooter = (value: unknown): LandingFooterContent | null => {
  const record = unwrapAttributes(value)
  if (!record) {
    return null
  }

  const copyright = getRequiredString(record, 'copyright')
  const note = getRequiredString(record, 'note')
  return copyright && note ? { copyright, note } : null
}

export const extractStrapiHomepage = (response: unknown): UnknownRecord | null => {
  if (!isRecord(response) || !('data' in response)) {
    return null
  }

  return unwrapAttributes(response.data)
}

export const isStrapiHomepageResponse = (response: unknown): boolean =>
  extractStrapiHomepage(response) !== null

export const mapStrapiLandingPage = (
  response: unknown,
  fallback: LandingPageContent,
  publicStrapiUrl: string
): LandingPageContent => {
  const homepage = extractStrapiHomepage(response)
  if (!homepage) {
    return fallback
  }

  return {
    seo: mapSeo(homepage.seo, publicStrapiUrl) ?? fallback.seo,
    header: mapHeader(homepage.header, publicStrapiUrl) ?? fallback.header,
    hero: mapHero(homepage.hero, publicStrapiUrl) ?? fallback.hero,
    services: mapServices(homepage.services, publicStrapiUrl) ?? fallback.services,
    solutions: mapSolutions(homepage.solutions, publicStrapiUrl) ?? fallback.solutions,
    process: mapProcess(homepage.process) ?? fallback.process,
    faq: mapFaq(homepage.faq) ?? fallback.faq,
    contact: mapContact(homepage.contact, publicStrapiUrl) ?? fallback.contact,
    footer: mapFooter(homepage.footer) ?? fallback.footer
  }
}
