<script setup lang="ts">
import { useLandingHeader } from '@/entities/landing/header'
import { LandingHeader } from '@/widgets/landing/header'
import { useI18n } from '#imports'

const { t } = useI18n()
const { content: headerContent } = useLandingHeader()
</script>

<template>
  <div
    id="top"
    class="landing-page-surface bg-landing-surface dark:bg-landing-surface-dark"
  >
    <LandingHeader :content="headerContent" />

    <main class="landing-layout-container landing-main">
      <section
        id="services"
        class="landing-placeholder-section"
      >
        {{ t('landing.scaffold.placeholder') }}
      </section>
      <section id="solutions" class="landing-anchor-offset" />
      <section id="process" class="landing-anchor-offset" />
      <section id="contact" class="landing-anchor-offset" />
    </main>
  </div>
</template>
