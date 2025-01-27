<script setup lang="ts">
import { useApiStore } from '~/stores/api'
const apiStore = useApiStore()

onMounted(async () => {
    await apiStore.fetchPages()
    console.log("Секции:", sections.value)
})

const pages = computed(() => apiStore.pages)

const currentPage = computed(() => {
    return pages.value.find((page) => page.alias === 'index') || null
})

const sections = computed(() => {
    return currentPage.value?.sections ? currentPage.value.sections.split('||') : []
})

const sectionMap = computed(() => {
    return sections.value.reduce((acc, section) => {
        acc[section] = defineAsyncComponent(() => import(`@/components/Sections/${section}.vue`))
        return acc
    }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>)
})
</script>

<template>
    <component v-for="section in sections" :is="sectionMap[section]" :key="section" />

</template>