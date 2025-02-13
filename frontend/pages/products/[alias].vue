<script setup lang="ts">
import { useApiStore } from '~/stores/api'
const route = useRoute()
const apiStore = useApiStore()
const config = useRuntimeConfig()
interface Product {
    id: number
    title: string
    description: string
    content: string
    parent: number
    category: string | null
    alias: string
    price?: string
    brand?: string
    taste?: string
    sticker?: string
    image?: string
    volume?: string
}
// Загрузка данных о продукте
const product = ref<Product | null>(null)

onMounted(async () => {
    if (apiStore.products.length === 0) {
        await apiStore.fetchProducts()
    }
    if (apiStore.brands.length === 0) {
        await apiStore.fetchBrands()
    }
    // Ищем продукт по alias
    product.value =
        apiStore.products.find(p => p.alias === route.params.alias) || null

    if (!product.value) {
        console.error(`Продукт с alias "${route.params.alias}" не найден`)
    }
})


const activeIndex = ref(0)
const volume = computed(() =>
    product.value?.volume ? product.value?.volume.split('||') : []
)
const onVolumeClick = (index: number) => {
    activeIndex.value = index
}
</script>

<template>
    <section class="section section-product" v-if="product">
        <div class="container product">
            <div class="product__image">
                <NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" height="420" />
            </div>
            <div class="product__info">
                <NuxtLink to="#" class="product__brand link">
                    {{ product.brand }}
                </NuxtLink>
                <div class="product__info-main">
                    <div class="product__info-left">
                        <h1 class="h1">{{ product.title }} {{ product.taste }}</h1>
                        <p class="product__description">{{ product.description }}</p>
                    </div>
                    <div class="product__info-right">
                        <div class="product__info-favorite favorite">
                            <NuxtIcon name="favorites" />
                        </div>
                    </div>
                </div>

                <div class="product__volume product__info-block">
                    <h3 class="h3">Объём</h3>
                    <div class="row">
                        <div :class="'product__volume-item' +
                            (index === activeIndex ? ' product__volume-item--active' : '')
                            " v-for="(volume, index) in volume" :key="index" @click="onVolumeClick(index)">
                            {{ volume }} мл
                        </div>
                    </div>
                </div>


                <div class="product__taste product__info-block">
                    <h3 class="h3">Вкус</h3>
                    <div class="row">
                        <div :class="'product__taste-item' +
                            (index === activeIndex ? ' product__taste-item--active' : '')
                            " v-for="(taste, index) in taste" :key="index" @click="onTasteClick(index)">
                            {{ taste }} мл
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div v-else>
        <p>Продукт не найден</p>
    </div>
</template>

<style lang="scss" scoped>
.product {
    @include flex(row, space-between, flex-start);
    gap: 64px;

    .h1 {
        font-size: auto-clamp(24px, 50px);
        font-weight: 700;
    }

    .product__image {
        @include flex(row, center, center);
        background-color: $color-light;
        padding: 80px;
        width: 100%;
        max-width: 580px;
    }

    .product__info {
        flex: 1;

        .product__brand {
            color: $color-gray;
            font-size: 12px;
            font-weight: 600;
        }

        .product__description {
            color: $color-gray;
            font-size: 16px;
            margin-top: 32px;
        }

        .product__info-main {
            @include flex(row, space-between, flex-start);
            gap: 16px;
            border-top: 2px solid $color-border;
            margin-top: 16px;

            .h1 {
                padding-top: 24px;
            }

            .product__info-right {
                @include flex(row, flex-end, center);
                min-width: 15%;
                border-left: 2px solid $color-border;
                padding-top: 24px;
            }

            .favorite {
                background-color: $color-light;
            }
        }

        .h3 {
            font-size: 24px;
        }

        .product__info-block {
            margin-top: 120px;
            border-top: 2px solid $color-border;
            padding-top: 15px;

            .row {
                @include flex(row, flex-start, flex-start);
                gap: 20px;
                margin-top: 24px;


                .product__volume-item {
                    cursor: pointer;
                    padding: 26px 72px;
                    transition: $transition;
                    background-color: $color-light;
                    font-size: 20px;

                    &:hover {
                        transform: translateY(-5px);
                    }

                    &--active {
                        background-color: $color-accent;

                    }
                }
            }
        }


    }
}
</style>
