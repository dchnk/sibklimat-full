import {
  contactChannelKeys,
  faqKeys,
  processStepKeys,
  serviceKeys,
  solutionTabs
} from './sections'
import type {
  LandingContactChannelType,
  LandingPageContent,
  LandingServiceIconKey
} from './types'

type Translate = (key: string) => string

const serviceIconKeys: Record<(typeof serviceKeys)[number], LandingServiceIconKey> = {
  residential: 'home',
  commercial: 'building',
  industrial: 'factory',
  ventilation: 'wind',
  service: 'wrench',
  automation: 'settings'
}

const contactLinks: Record<(typeof contactChannelKeys)[number], string> = {
  phone: 'tel:+73832120000',
  email: 'mailto:hello@sibklimat.ru',
  location: 'https://yandex.ru/maps'
}

const contactTypes: Record<
  (typeof contactChannelKeys)[number],
  LandingContactChannelType
> = {
  phone: 'phone',
  email: 'email',
  location: 'location'
}

export const createLandingPageFallback = (t: Translate): LandingPageContent => ({
  seo: {
    metaTitle: t('landing.seo.metaTitle'),
    metaDescription: t('landing.seo.metaDescription')
  },
  header: {
    brand: t('landing.header.brand'),
    brandHref: '#top',
    tagline: t('landing.header.tagline'),
    navigation: [
      {
        id: 'services',
        href: '#services',
        label: t('landing.header.navigation.services')
      },
      {
        id: 'solutions',
        href: '#solutions',
        label: t('landing.header.navigation.solutions')
      },
      {
        id: 'process',
        href: '#process',
        label: t('landing.header.navigation.process')
      },
      {
        id: 'contact',
        href: '#contact',
        label: t('landing.header.navigation.contact')
      }
    ],
    ctaLabel: t('landing.header.cta'),
    ctaHref: '#contact'
  },
  hero: {
    badge: t('landing.hero.badge'),
    title: t('landing.hero.title'),
    subtitle: t('landing.hero.subtitle'),
    primaryCtaLabel: t('landing.hero.primaryCta'),
    primaryCtaHref: '#contact',
    secondaryCtaLabel: t('landing.hero.secondaryCta'),
    kpis: ['projects', 'response', 'warranty'].map((key) => ({
      id: key,
      value: t(`landing.hero.kpis.${key}.value`),
      label: t(`landing.hero.kpis.${key}.label`)
    })),
    quickDialogTitle: t('landing.hero.quickDialog.title'),
    quickDialogDescription: t('landing.hero.quickDialog.description'),
    quickDialogItems: ['audit', 'equipment', 'budget'].map((key) => ({
      id: key,
      text: t(`landing.hero.quickDialog.items.${key}`)
    })),
    panelTitle: t('landing.hero.panel.title'),
    panelDescription: t('landing.hero.panel.description'),
    panelPlaceholderTitle: t('landing.hero.panel.mediaTitle'),
    panelPlaceholderDescription: t('landing.hero.panel.mediaDescription'),
    panelPoints: ['certified', 'transparent', 'support'].map((key) => ({
      id: key,
      text: t(`landing.hero.panel.points.${key}`)
    }))
  },
  services: {
    badge: t('landing.services.badge'),
    title: t('landing.services.title'),
    subtitle: t('landing.services.subtitle'),
    mediaPlaceholder: t('landing.mediaPlaceholder'),
    items: serviceKeys.map((key) => ({
      id: key,
      slug: key,
      iconKey: serviceIconKeys[key],
      chip: t(`landing.services.items.${key}.chip`),
      title: t(`landing.services.items.${key}.title`),
      description: t(`landing.services.items.${key}.description`),
      points: [1, 2].map((point) => ({
        id: `${key}-point-${point}`,
        text: t(`landing.services.items.${key}.point${point}`)
      }))
    }))
  },
  solutions: {
    badge: t('landing.solutions.badge'),
    title: t('landing.solutions.title'),
    subtitle: t('landing.solutions.subtitle'),
    mediaPlaceholder: t('landing.mediaPlaceholder'),
    tabs: solutionTabs.map((tab) => ({
      id: tab.value,
      slug: tab.value,
      label: t(`landing.solutions.tabs.${tab.value}.label`),
      cards: tab.cardKeys.map((cardKey) => ({
        id: `${tab.value}-${cardKey}`,
        slug: cardKey,
        title: t(`landing.solutions.tabs.${tab.value}.cards.${cardKey}.title`),
        description: t(
          `landing.solutions.tabs.${tab.value}.cards.${cardKey}.description`
        ),
        points: [1, 2].map((point) => ({
          id: `${tab.value}-${cardKey}-point-${point}`,
          text: t(
            `landing.solutions.tabs.${tab.value}.cards.${cardKey}.point${point}`
          )
        }))
      }))
    }))
  },
  process: {
    badge: t('landing.process.badge'),
    title: t('landing.process.title'),
    subtitle: t('landing.process.subtitle'),
    steps: processStepKeys.map((key) => ({
      id: key,
      slug: key,
      title: t(`landing.process.steps.${key}.title`),
      description: t(`landing.process.steps.${key}.description`)
    })),
    metrics: ['speed', 'accuracy', 'support'].map((key) => ({
      id: key,
      value: t(`landing.process.metrics.${key}.value`),
      label: t(`landing.process.metrics.${key}.label`)
    }))
  },
  faq: {
    badge: t('landing.faq.badge'),
    title: t('landing.faq.title'),
    subtitle: t('landing.faq.subtitle'),
    items: faqKeys.map((key) => ({
      id: key,
      slug: key,
      question: t(`landing.faq.items.${key}.question`),
      answer: t(`landing.faq.items.${key}.answer`)
    }))
  },
  contact: {
    badge: t('landing.contact.badge'),
    title: t('landing.contact.title'),
    subtitle: t('landing.contact.subtitle'),
    directTitle: t('landing.contact.directTitle'),
    directDescription: t('landing.contact.directDescription'),
    channels: contactChannelKeys.map((key) => ({
      id: key,
      type: contactTypes[key],
      label: t(`landing.contact.channels.${key}.label`),
      value: t(`landing.contact.channels.${key}.value`),
      href: contactLinks[key],
      openInNewTab: key === 'location'
    })),
    mapPlaceholderTitle: t('landing.contact.mapPlaceholderTitle'),
    mapPlaceholderDescription: t('landing.contact.mapPlaceholderDescription'),
    form: {
      title: t('landing.contact.form.title'),
      description: t('landing.contact.form.description'),
      nameLabel: t('landing.contact.form.fields.name'),
      namePlaceholder: t('landing.contact.form.placeholders.name'),
      phoneLabel: t('landing.contact.form.fields.phone'),
      phonePlaceholder: t('landing.contact.form.placeholders.phone'),
      requestTypeLabel: t('landing.contact.form.fields.requestType'),
      requestTypePlaceholder: t('landing.contact.form.placeholders.requestType'),
      detailsLabel: t('landing.contact.form.fields.details'),
      detailsPlaceholder: t('landing.contact.form.placeholders.details'),
      options: ['consultation', 'installation', 'service'].map((key) => ({
        id: key,
        value: key,
        label: t(`landing.contact.form.options.${key}`)
      })),
      agreementLabel: t('landing.contact.form.agreement'),
      submitLabel: t('landing.contact.form.submit')
    }
  },
  footer: {
    copyright: t('landing.footer.copyright'),
    note: t('landing.footer.note')
  }
})
