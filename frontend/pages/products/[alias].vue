<script setup lang="ts">
import { useApiStore } from '~/stores/api'
const route = useRoute()
const apiStore = useApiStore()
const config = useRuntimeConfig()
interface Products {
    id: number
    title: string
    introtext: string
    content: string
    parent: number
    category: string | null
    alias: string
    uri: string
    price?: string
    taste?: string
    sticker?: string
    image?: string
    volume?: string
    brand?: string
}
// Загрузка данных о продукте
const product = ref<Products | null>(null)

onMounted(async () => {
    if (apiStore.products.length === 0) {
        await apiStore.fetchProducts()
    }

    // Ищем продукт по alias
    product.value = apiStore.products.find((p) => p.alias === route.params.alias) || null

    if (!product.value) {
        console.error(`Продукт с alias "${route.params.alias}" не найден`)
    }
})
</script>

<template>
    <section class="section section-product" v-if="product">
        <div class="container product">
            <div class="product__image">
                <NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" loading="lazy" height="420" />
            </div>
            <div class="product__info">
                <h1 class="h1">{{ product.title }}</h1>
                <p>{{ product.introtext }}</p>
                <div v-html="product.content"></div>
                <p v-if="product.price">Цена: {{ product.price }}</p>
                <p v-if="product.volume">Объем: {{ product.volume }}</p>
                <p v-if="product.brand">Бренд: {{ product.brand }}</p>
            </div>
        </div>
    </section>
    <div v-else>
        <p>Продукт не найден</p>
    </div>

</template>

<style lang="scss" scoped>
.product {
    .h1 {
        font-size: auto-clamp(24px, 50px);
        font-weight: 700
    }

    @include flex(row, space-between, flex-start);

    .product__image {
        background-color: $color-light;
        padding: 80px;
    }
}
</style>
