// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/app/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n'],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ru',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      { code: 'ru', name: 'Russian', file: 'ru.ts' },
      { code: 'en', name: 'English', file: 'en.ts' }
    ],
    vueI18n: './i18n.config.ts'
  },
  runtimeConfig: {
    public: {
      siteUrl: import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      strapiUrl: import.meta.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    }
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
  app: {
    head: {
      title: 'SibKlimat | Air Conditioning and Ventilation',
      meta: [
        {
          name: 'description',
          content: 'Design, installation and maintenance of air conditioning and ventilation systems in Novosibirsk.'
        }
      ]
    }
  }
})
