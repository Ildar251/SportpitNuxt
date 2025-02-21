<script lang="ts" setup>
defineProps<{
    page?: { title?: string }
    noInfoTitle?: boolean
}>()
</script>

<template>
    <section>
        <div class="container" v-if="!noInfoTitle">
            <h1 class="h1 page-title">{{ page?.title }}</h1>
        </div>

        <div class="container breadcrumbs">
            <div class="breadcrumbs__item">Главная страница</div>
            <div class="breadcrumbs__item">{{ page?.title }}</div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.breadcrumbs {
    display: flex;
    flex-wrap: wrap;
    margin-top: auto-clamp(50px, 100px);
    padding-bottom: 16px;
    margin-bottom: calc(auto-clamp(50px, 100px) * -1);
    font-size: 12px;
    color: $color-gray;

    .breadcrumbs__item {
        &:not(:last-child)::after {
            content: '/';
            margin: 0 20px;
        }
    }
}
</style>