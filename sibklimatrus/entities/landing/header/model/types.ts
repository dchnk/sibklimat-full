import type { HeaderText } from './text'

export interface LandingHeaderNavigationItem {
  id: string
  href: string
  label: HeaderText
}

export interface LandingHeaderAction {
  href: string
  label: HeaderText
}

export interface LandingHeaderContent {
  brand: HeaderText
  tagline: HeaderText
  navigation: LandingHeaderNavigationItem[]
  cta: LandingHeaderAction
}
