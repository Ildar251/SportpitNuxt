<script lang="ts" setup>
defineProps(['product'])
const config = useRuntimeConfig()
</script>

<template>
    <div class="card">
        <div class="card__image">
            <NuxtImg :src="config.public.strapiUrl + product.image.url" :alt="product.title" />
        </div>
        <div class="card__content">
            <div class="card__brend">{{ product.brend.title }}</div>
            <h3 class="card__title">{{ product.title }}</h3>
            <span class="card__price">{{ product.price }} ₽</span>
        </div>

    </div>
</template>


<style lang="scss" scoped>
.card {
    @include flex(column, center, center);
    gap: 20px;
    padding: 20px;
    cursor: pointer;
    transition: $transition;

    &:hover {
        background-color: $secondary;
    }

    .card__image {
        @include flex(column, center, center);
    }

    .card__content {
        @include flex(column, flex-start, flex-start);
        gap: 10px;
    }

    .card__brend {
        color: $gray;
        font-size: 12px;
        border-bottom: 2px solid $light;
        width: 100%;
        padding-bottom: 12px;
        font-weight: 600;
    }

    .card__title {
        color: $primary;
        font-size: 18px;
        font-weight: 700;
    }

    .card__price {
        color: $primary;
        font-size: 18px;
        font-weight: 700;
    }
}
</style>