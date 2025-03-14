<script setup lang="ts">
const props = defineProps<{
    data?: { text?: string }
    page?: any
}>()

const text = computed(() => {
    try {
        return props.data?.text ? JSON.parse(props.data.text) : []
    } catch (error) {
        console.error('❌ Ошибка парсинга MIGX-поля text:', error)
        return []
    }
})
</script>

<template>
    <section class="section section-text">
        <div class="container">
            <div v-for="item in text" :key="item.id" v-html="item.text"></div>
        </div>
    </section>
</template>

<style lang="scss" scoped></style>