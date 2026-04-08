<script setup lang="ts">
import { useLandingHeader } from '@/entities/landing/header'
import { LandingContact } from '@/widgets/landing/contact'
import { LandingFaq } from '@/widgets/landing/faq'
import { LandingFooter } from '@/widgets/landing/footer'
import { LandingHeader } from '@/widgets/landing/header'
import { LandingHero } from '@/widgets/landing/hero'
import { LandingProcess } from '@/widgets/landing/process'
import { LandingServices } from '@/widgets/landing/services'
import { LandingSolutions } from '@/widgets/landing/solutions'
const { content: headerContent } = useLandingHeader()
</script>

<template>
  <div
    id="top"
    class="landing-page-surface bg-landing-surface dark:bg-landing-surface-dark"
  >
    <LandingHeader :content="headerContent" />

    <main class="landing-layout-container landing-main">
      <LandingHero />
      <LandingServices />
      <LandingSolutions />
      <LandingProcess />
      <LandingFaq />
      <LandingContact />
      <LandingFooter />
    </main>
  </div>
</template>
