<script setup lang="ts">
import { usePage } from '~/composables/usePage'

const { sections, sectionMap, sectionsData } = usePage('index')


</script>

<template>
  <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]" />
</template>
