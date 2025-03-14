<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, page } = usePage('about')

</script>

<template>
  <main>
    <component v-for="section in sections" :page="page" :is="sectionMap[section]" :key="section"
      :data="sectionsData[section]" />
  </main>
</template>
