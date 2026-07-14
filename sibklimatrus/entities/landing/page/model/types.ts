export interface LandingMedia {
  url: string
  alternativeText?: string
  caption?: string
  name?: string
  mime?: string
  width?: number
  height?: number
}

export interface LandingSeoContent {
  metaTitle: string
  metaDescription: string
  shareImage?: LandingMedia
}

export interface LandingNavigationItem {
  id: string
  label: string
  href: string
}

export interface LandingHeaderContent {
  logo?: LandingMedia
  brand: string
  brandHref: string
  tagline: string
  navigation: LandingNavigationItem[]
  ctaLabel: string
  ctaHref: string
}

export interface LandingTextItem {
  id: string
  text: string
}

export interface LandingMetric {
  id: string
  value: string
  label: string
}

export interface LandingHeroContent {
  badge: string
  title: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  kpis: LandingMetric[]
  quickDialogTitle: string
  quickDialogDescription: string
  quickDialogItems: LandingTextItem[]
  panelTitle: string
  panelDescription: string
  panelImage?: LandingMedia
  panelPlaceholderTitle: string
  panelPlaceholderDescription: string
  panelPoints: LandingTextItem[]
}

export type LandingServiceIconKey =
  | 'home'
  | 'building'
  | 'factory'
  | 'wind'
  | 'wrench'
  | 'settings'

export interface LandingServiceItem {
  id: string
  slug: string
  iconKey: LandingServiceIconKey
  chip: string
  title: string
  description: string
  image?: LandingMedia
  points: LandingTextItem[]
}

export interface LandingServicesContent {
  badge: string
  title: string
  subtitle: string
  mediaPlaceholder: string
  items: LandingServiceItem[]
}

export interface LandingSolutionCard {
  id: string
  slug: string
  title: string
  description: string
  image?: LandingMedia
  points: LandingTextItem[]
}

export interface LandingSolutionTab {
  id: string
  slug: string
  label: string
  cards: LandingSolutionCard[]
}

export interface LandingSolutionsContent {
  badge: string
  title: string
  subtitle: string
  mediaPlaceholder: string
  tabs: LandingSolutionTab[]
}

export interface LandingProcessStep {
  id: string
  slug: string
  title: string
  description: string
}

export interface LandingProcessContent {
  badge: string
  title: string
  subtitle: string
  steps: LandingProcessStep[]
  metrics: LandingMetric[]
}

export interface LandingFaqItem {
  id: string
  slug: string
  question: string
  answer: string
}

export interface LandingFaqContent {
  badge: string
  title: string
  subtitle: string
  items: LandingFaqItem[]
}

export type LandingContactChannelType = 'phone' | 'email' | 'location' | 'other'

export interface LandingContactChannel {
  id: string
  type: LandingContactChannelType
  label: string
  value: string
  href: string
  openInNewTab: boolean
}

export interface LandingRequestOption {
  id: string
  value: string
  label: string
}

export interface LandingContactFormContent {
  title: string
  description: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  requestTypeLabel: string
  requestTypePlaceholder: string
  detailsLabel: string
  detailsPlaceholder: string
  options: LandingRequestOption[]
  agreementLabel: string
  submitLabel: string
}

export interface LandingContactContent {
  badge: string
  title: string
  subtitle: string
  directTitle: string
  directDescription: string
  channels: LandingContactChannel[]
  mapImage?: LandingMedia
  mapPlaceholderTitle: string
  mapPlaceholderDescription: string
  form: LandingContactFormContent
}

export interface LandingFooterContent {
  copyright: string
  note: string
}

export interface LandingPageContent {
  seo: LandingSeoContent
  header: LandingHeaderContent
  hero: LandingHeroContent
  services: LandingServicesContent
  solutions: LandingSolutionsContent
  process: LandingProcessContent
  faq: LandingFaqContent
  contact: LandingContactContent
  footer: LandingFooterContent
}
