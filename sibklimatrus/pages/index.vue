<script setup lang="ts">
import ContactSection from "@/widgets/landing/ui/ContactSection.vue"
import HeroSection from "@/widgets/landing/ui/HeroSection.vue"
import ProcessSection from "@/widgets/landing/ui/ProcessSection.vue"
import ServicesSection from "@/widgets/landing/ui/ServicesSection.vue"
import SiteFooter from "@/widgets/landing/ui/SiteFooter.vue"
import SiteHeader from "@/widgets/landing/ui/SiteHeader.vue"
import SolutionsSection from "@/widgets/landing/ui/SolutionsSection.vue"
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef6f6_38%,_#ffffff_100%)] text-slate-900">
    <div class="mx-auto max-w-7xl px-6 py-6 lg:px-10">
      <SiteHeader />

      <main class="pb-16 pt-8 md:pt-10">
        <HeroSection />
        <ServicesSection />
        <SolutionsSection />
        <ProcessSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  </div>
</template>
