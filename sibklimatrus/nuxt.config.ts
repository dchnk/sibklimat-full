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
    strapiUrl: process.env.NUXT_STRAPI_URL || 'http://localhost:1337',
    strapiApiToken: process.env.NUXT_STRAPI_API_TOKEN || '',
    smartCaptchaServerKey: process.env.NUXT_SMART_CAPTCHA_SERVER_KEY || '',
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID || '',
    leadRateLimitMax: Number(process.env.NUXT_LEAD_RATE_LIMIT_MAX || 5),
    leadRateLimitWindowMs: Number(
      process.env.NUXT_LEAD_RATE_LIMIT_WINDOW_MS || 600000
    ),
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteIndexable: process.env.NUXT_PUBLIC_SITE_INDEXABLE === 'true',
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      smartCaptchaSiteKey:
        process.env.NUXT_PUBLIC_SMART_CAPTCHA_SITE_KEY || ''
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
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=2' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=2' }
      ]
    }
  }
})
