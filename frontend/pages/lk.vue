<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('lk')

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
        <SectionsLk />
    </main>
</template>
