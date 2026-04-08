export const serviceKeys = [
  'residential',
  'commercial',
  'industrial',
  'ventilation',
  'service',
  'automation'
] as const

export const solutionTabs = [
  {
    value: 'apartments',
    cardKeys: ['comfort', 'silent', 'smart']
  },
  {
    value: 'business',
    cardKeys: ['retail', 'office', 'food']
  },
  {
    value: 'industry',
    cardKeys: ['workshop', 'warehouse', 'server']
  }
] as const

export const processStepKeys = [
  'audit',
  'design',
  'installation',
  'commissioning',
  'service'
] as const

export const faqKeys = [
  'timing',
  'pricing',
  'warranty',
  'brands',
  'noise',
  'support'
] as const

export const contactChannelKeys = ['phone', 'email', 'location'] as const
