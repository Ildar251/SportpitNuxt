<script setup lang="ts">
import { usePage } from '~/composables/usePage'


const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('catalog')
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
        <SectionsPageInfo :page="page" />
        <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]" />
    </main>
</template>
