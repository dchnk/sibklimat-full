import messages from '../i18n/locales/ru.ts'

const landing = messages.landing

const getText = (...path) => {
  let value = landing

  for (const segment of path) {
    value = value?.[segment]
  }

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing Russian text: landing.${path.join('.')}`)
  }

  return value.replaceAll("{'@'}", '@')
}

const serviceDefinitions = [
  ['residential', 'home'],
  ['commercial', 'building'],
  ['industrial', 'factory'],
  ['ventilation', 'wind'],
  ['service', 'wrench'],
  ['automation', 'settings']
]

const solutionDefinitions = [
  ['apartments', ['comfort', 'silent', 'smart']],
  ['business', ['retail', 'office', 'food']],
  ['industry', ['workshop', 'warehouse', 'server']]
]

const processStepKeys = ['audit', 'design', 'installation', 'commissioning', 'service']
const faqKeys = ['timing', 'pricing', 'warranty', 'brands', 'noise', 'support']

const payload = {
  seo: {
    metaTitle: getText('seo', 'metaTitle'),
    metaDescription: getText('seo', 'metaDescription'),
    shareImageAlt: getText('seo', 'metaTitle')
  },
  header: {
    brand: getText('header', 'brand'),
    logoAlt: getText('header', 'brand'),
    brandHref: '#top',
    tagline: getText('header', 'tagline'),
    navigation: [
      { label: getText('header', 'navigation', 'services'), href: '#services' },
      { label: getText('header', 'navigation', 'solutions'), href: '#solutions' },
      { label: getText('header', 'navigation', 'process'), href: '#process' },
      { label: getText('header', 'navigation', 'contact'), href: '#contact' }
    ],
    ctaLabel: getText('header', 'cta'),
    ctaHref: '#contact'
  },
  hero: {
    badge: getText('hero', 'badge'),
    title: getText('hero', 'title'),
    subtitle: getText('hero', 'subtitle'),
    primaryCtaLabel: getText('hero', 'primaryCta'),
    primaryCtaHref: '#contact',
    secondaryCtaLabel: getText('hero', 'secondaryCta'),
    kpis: ['projects', 'response', 'warranty'].map((key) => ({
      value: getText('hero', 'kpis', key, 'value'),
      label: getText('hero', 'kpis', key, 'label')
    })),
    quickDialogTitle: getText('hero', 'quickDialog', 'title'),
    quickDialogDescription: getText('hero', 'quickDialog', 'description'),
    quickDialogItems: ['audit', 'equipment', 'budget'].map((key) => ({
      text: getText('hero', 'quickDialog', 'items', key)
    })),
    panelTitle: getText('hero', 'panel', 'title'),
    panelDescription: getText('hero', 'panel', 'description'),
    panelImageAlt: getText('hero', 'panel', 'title'),
    panelPlaceholderTitle: getText('hero', 'panel', 'mediaTitle'),
    panelPlaceholderDescription: getText('hero', 'panel', 'mediaDescription'),
    panelPoints: ['certified', 'transparent', 'support'].map((key) => ({
      text: getText('hero', 'panel', 'points', key)
    }))
  },
  services: {
    badge: getText('services', 'badge'),
    title: getText('services', 'title'),
    subtitle: getText('services', 'subtitle'),
    mediaPlaceholder: getText('mediaPlaceholder'),
    items: serviceDefinitions.map(([slug, iconKey]) => {
      const title = getText('services', 'items', slug, 'title')

      return {
        slug,
        iconKey,
        chip: getText('services', 'items', slug, 'chip'),
        title,
        description: getText('services', 'items', slug, 'description'),
        imageAlt: title,
        points: [1, 2].map((point) => ({
          text: getText('services', 'items', slug, `point${point}`)
        }))
      }
    })
  },
  solutions: {
    badge: getText('solutions', 'badge'),
    title: getText('solutions', 'title'),
    subtitle: getText('solutions', 'subtitle'),
    mediaPlaceholder: getText('mediaPlaceholder'),
    tabs: solutionDefinitions.map(([slug, cardKeys]) => ({
      slug,
      label: getText('solutions', 'tabs', slug, 'label'),
      cards: cardKeys.map((cardSlug) => {
        const title = getText('solutions', 'tabs', slug, 'cards', cardSlug, 'title')

        return {
          slug: cardSlug,
          title,
          description: getText(
            'solutions',
            'tabs',
            slug,
            'cards',
            cardSlug,
            'description'
          ),
          imageAlt: title,
          points: [1, 2].map((point) => ({
            text: getText(
              'solutions',
              'tabs',
              slug,
              'cards',
              cardSlug,
              `point${point}`
            )
          }))
        }
      })
    }))
  },
  process: {
    badge: getText('process', 'badge'),
    title: getText('process', 'title'),
    subtitle: getText('process', 'subtitle'),
    steps: processStepKeys.map((slug) => ({
      slug,
      title: getText('process', 'steps', slug, 'title'),
      description: getText('process', 'steps', slug, 'description')
    })),
    metrics: ['speed', 'accuracy', 'support'].map((key) => ({
      value: getText('process', 'metrics', key, 'value'),
      label: getText('process', 'metrics', key, 'label')
    }))
  },
  faq: {
    badge: getText('faq', 'badge'),
    title: getText('faq', 'title'),
    subtitle: getText('faq', 'subtitle'),
    items: faqKeys.map((slug) => ({
      slug,
      question: getText('faq', 'items', slug, 'question'),
      answer: getText('faq', 'items', slug, 'answer')
    }))
  },
  contact: {
    badge: getText('contact', 'badge'),
    title: getText('contact', 'title'),
    subtitle: getText('contact', 'subtitle'),
    directTitle: getText('contact', 'directTitle'),
    directDescription: getText('contact', 'directDescription'),
    channels: [
      {
        type: 'phone',
        label: getText('contact', 'channels', 'phone', 'label'),
        value: getText('contact', 'channels', 'phone', 'value'),
        href: 'tel:+73832120000',
        openInNewTab: false
      },
      {
        type: 'email',
        label: getText('contact', 'channels', 'email', 'label'),
        value: getText('contact', 'channels', 'email', 'value'),
        href: 'mailto:hello@sibklimat.ru',
        openInNewTab: false
      },
      {
        type: 'location',
        label: getText('contact', 'channels', 'location', 'label'),
        value: getText('contact', 'channels', 'location', 'value'),
        href: 'https://yandex.ru/maps',
        openInNewTab: true
      }
    ],
    mapImageAlt: getText('contact', 'mapPlaceholderTitle'),
    mapPlaceholderTitle: getText('contact', 'mapPlaceholderTitle'),
    mapPlaceholderDescription: getText('contact', 'mapPlaceholderDescription'),
    form: {
      title: getText('contact', 'form', 'title'),
      description: getText('contact', 'form', 'description'),
      nameLabel: getText('contact', 'form', 'fields', 'name'),
      namePlaceholder: getText('contact', 'form', 'placeholders', 'name'),
      phoneLabel: getText('contact', 'form', 'fields', 'phone'),
      phonePlaceholder: getText('contact', 'form', 'placeholders', 'phone'),
      requestTypeLabel: getText('contact', 'form', 'fields', 'requestType'),
      requestTypePlaceholder: getText('contact', 'form', 'placeholders', 'requestType'),
      detailsLabel: getText('contact', 'form', 'fields', 'details'),
      detailsPlaceholder: getText('contact', 'form', 'placeholders', 'details'),
      options: ['consultation', 'installation', 'service'].map((value) => ({
        value,
        label: getText('contact', 'form', 'options', value)
      })),
      agreementLabel: getText('contact', 'form', 'agreement'),
      submitLabel: getText('contact', 'form', 'submit')
    }
  },
  footer: {
    copyright: getText('footer', 'copyright'),
    note: getText('footer', 'note')
  }
}

process.stdout.write(`${Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')}\n`)
