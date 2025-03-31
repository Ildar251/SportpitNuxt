<script setup lang="ts">
import { usePage } from '~/composables/usePage'
// Получаем данные страницы
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('ctm')

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <main>
    <component v-for="section in sections" :is="sectionMap[section]" :page="page" :key="section"
      :data="sectionsData[section]" />
  </main>
</template>