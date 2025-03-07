<script setup lang="ts">
import { usePage } from '~/composables/usePage'

const { sections, sectionMap, sectionsData, page } = usePage('lk')
</script>

<template>
    <main>
        <SectionsPageInfo :page="page" />
        <SectionsLk />
    </main>
</template>
