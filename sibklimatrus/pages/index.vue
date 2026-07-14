<script setup lang="ts">
import { useHead, useI18n, useSeoMeta } from '#imports'
import { useLandingPage } from '@/entities/landing/page'
import { LandingContact } from '@/widgets/landing/contact'
import { LandingFaq } from '@/widgets/landing/faq'
import { LandingFooter } from '@/widgets/landing/footer'
import { LandingHeader } from '@/widgets/landing/header'
import { LandingHero } from '@/widgets/landing/hero'
import { LandingProcess } from '@/widgets/landing/process'
import { LandingServices } from '@/widgets/landing/services'
import { LandingSolutions } from '@/widgets/landing/solutions'

const { locale } = useI18n()
const { content } = useLandingPage()

useSeoMeta({
  title: () => content.value.seo.metaTitle,
  description: () => content.value.seo.metaDescription,
  ogTitle: () => content.value.seo.metaTitle,
  ogDescription: () => content.value.seo.metaDescription,
  ogImage: () => content.value.seo.shareImage?.url,
  ogImageAlt: () => content.value.seo.shareImage?.alternativeText,
  ogImageWidth: () => content.value.seo.shareImage?.width,
  ogImageHeight: () => content.value.seo.shareImage?.height,
  twitterCard: 'summary_large_image',
  twitterTitle: () => content.value.seo.metaTitle,
  twitterDescription: () => content.value.seo.metaDescription,
  twitterImage: () => content.value.seo.shareImage?.url,
  twitterImageAlt: () => content.value.seo.shareImage?.alternativeText
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  }
}))
</script>

<template>
  <div
    id="top"
    class="landing-page-surface bg-landing-surface dark:bg-landing-surface-dark"
  >
    <LandingHeader :content="content.header" />

    <main class="landing-layout-container landing-main">
      <LandingHero :content="content.hero" />
      <LandingServices :content="content.services" />
      <LandingSolutions :content="content.solutions" />
      <LandingProcess :content="content.process" />
      <LandingFaq :content="content.faq" />
      <LandingContact :content="content.contact" />
      <LandingFooter :content="content.footer" />
    </main>
  </div>
</template>
