<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onMounted, onUpdated } from 'vue'

gsap.registerPlugin(ScrollTrigger)

import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData } = usePage('index')

// Функция для обновления ScrollTrigger
const refreshScrollTrigger = async () => {
  await nextTick() // Ждём рендеринг DOM
  console.log('Обновляем ScrollTrigger...')
  ScrollTrigger.refresh()
}

onMounted(async () => {
  await nextTick()
  refreshScrollTrigger()
})

onUpdated(() => {
  // Если компоненты или данные обновились, пересчитываем позиции
  refreshScrollTrigger()
})
</script>

<template>
  <main>
    <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]" />
  </main>
</template>