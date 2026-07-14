/**
 * Keep every nested component/media path explicit. Strapi does not deep-populate
 * nested components with a top-level `populate=*`.
 */
export const landingPagePopulateQuery = {
  'populate[seo][populate][shareImage]': true,
  'populate[header][populate][logo]': true,
  'populate[header][populate][navigation]': '*',
  'populate[hero][populate][kpis]': '*',
  'populate[hero][populate][quickDialogItems]': '*',
  'populate[hero][populate][panelImage]': true,
  'populate[hero][populate][panelPoints]': '*',
  'populate[services][populate][items][populate][image]': true,
  'populate[services][populate][items][populate][points]': '*',
  'populate[solutions][populate][tabs][populate][cards][populate][image]': true,
  'populate[solutions][populate][tabs][populate][cards][populate][points]': '*',
  'populate[process][populate][steps]': '*',
  'populate[process][populate][metrics]': '*',
  'populate[faq][populate][items]': '*',
  'populate[contact][populate][channels]': '*',
  'populate[contact][populate][mapImage]': true,
  'populate[contact][populate][form][populate][options]': '*',
  'populate[footer]': '*'
} as const
