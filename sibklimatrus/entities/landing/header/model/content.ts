import type { LandingHeaderContent } from './types'
import { i18nText } from './text'

export const landingHeaderContent: LandingHeaderContent = {
  brand: i18nText('landing.header.brand'),
  tagline: i18nText('landing.header.tagline'),
  navigation: [
    {
      id: 'services',
      href: '#services',
      label: i18nText('landing.header.navigation.services')
    },
    {
      id: 'solutions',
      href: '#solutions',
      label: i18nText('landing.header.navigation.solutions')
    },
    {
      id: 'process',
      href: '#process',
      label: i18nText('landing.header.navigation.process')
    },
    {
      id: 'contact',
      href: '#contact',
      label: i18nText('landing.header.navigation.contact')
    }
  ],
  cta: {
    href: '#contact',
    label: i18nText('landing.header.cta')
  }
}
