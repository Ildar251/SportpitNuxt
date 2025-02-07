<script setup lang="ts">
import { usePage } from '~/composables/usePage'

const { sections, sectionMap, sectionsData, page } = usePage('catalog')
</script>

<template>
    <SectionsPageInfo :page="page" />

    <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]" />
</template>
