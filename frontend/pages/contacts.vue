<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, page } = usePage('contacts')
</script>

<template>
  <main>
    <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]"
      :page="page" />
  </main>
</template>
