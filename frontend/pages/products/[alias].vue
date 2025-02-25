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
    price_old?: string
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
    <main>
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
                            <!-- <div :class="'product__taste-item' +
                            (index === activeIndex ? ' product__taste-item--active' : '')
                            " v-for="(taste, index) in taste" :key="index" @click="onTasteClick(index)">
                            {{ taste }} мл
                        </div> -->
                        </div>
                    </div>

                    <div class="row">
                        <div class="product__price">
                            <span class="price">{{ product.price }} ₽</span>
                            <span class="price-old">{{ product.price_old }} ₽</span>
                        </div>
                        <div class="product__price-info">
                            <NuxtIcon name="warning" />
                            <div>
                                <h4 class="h4">Указана розничная цена.</h4>
                                <span>Авторизуйтесь на сайте, чтобы увидеть оптовые цены.</span>
                                <span class="warning">Минимальная сумма заказа 10 000 ₽</span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <button class="btn add-to-cart">
                            <span class="span-text">В корзину</span>
                            <NuxtIcon name="plus" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

</template>

<style lang="scss" scoped>
.product {
    @include flex(row, space-between, flex-start);
    gap: auto-clamp(32px, 64px);

    @media screen and (max-width: 768px) {
        @include flex(column, center, center);
    }

    .h1 {
        font-size: auto-clamp(24px, 50px);
        font-weight: 700;
    }

    .product__image {
        @include flex(row, center, center);
        background-color: $color-light;
        padding: auto-clamp(40px, 80px);
        width: 100%;
        max-width: auto-clamp(290px, 580px);
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
            font-size: auto-clamp(18px, 24px);
        }

        .product__info-block {
            margin-top: auto-clamp(60px, 120px);
            border-top: 2px solid $color-border;
            padding-top: 15px;

            .row {
                @include flex(row, flex-start, flex-start);
                gap: 20px;
                margin-top: 24px;


                .product__volume-item {
                    cursor: pointer;
                    padding: auto-clamp(13px, 26px) auto-clamp(36px, 72px);
                    transition: $transition;
                    background-color: $color-light;
                    font-size: 20px;
                    white-space: nowrap;

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

    .product__price {
        @include flex(row, center, center);
        background-color: $color-orange;
        padding: auto-clamp(12px, 25px) auto-clamp(7px, 14px) auto-clamp(12px, 25px) auto-clamp(32px, 64px);
        position: relative;
        flex: 1;
        white-space: nowrap;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: -25px;
            width: 50px;
            background-color: $color-orange;
            transform: skewX(-20deg);
            z-index: -1;
        }

        .price {
            font-size: auto-clamp(24px, 70px);
            font-weight: 700;
            line-height: 1;
        }

        .price-old {
            font-size: auto-clamp(16px, 24px);
            font-weight: 700;
            margin-left: auto-clamp(10px, 20px);
            color: $color-white;
            position: relative;
            line-height: 1;
            height: 100%;

            &::after {
                content: '';
                display: block;
                width: 100%;
                height: 2px;
                background-color: currentColor;
                position: absolute;
                top: auto-clamp(5px, 10px);
                left: 50%;
                transform: translate(-50%, -50%) rotate(-25deg);
                transform-origin: center;
            }
        }


    }

    .product__price-info {
        @include flex(row, flex-start, flex-start);
        gap: 10px;
        background-color: $color-light;
        margin-left: 60px;
        position: relative;
        padding: auto-clamp(10px, 20px);
        flex: 3;

        .nuxt-icon {
            font-size: auto-clamp(12px, 24px);
            margin-top: 5px;
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: -25px;
            width: 50px;
            background-color: $color-light;
            transform: skewX(-20deg);
            z-index: -1;
        }

        .h4 {
            font-size: auto-clamp(10px, 20px);
        }

        .h4+span {
            font-size: auto-clamp(10px, 16px);
            color: $color-gray;
            font-weight: 400;
            display: inline-block;
        }

        .warning {
            display: inline-block;
            margin-top: auto-clamp(10px, 20px);
            font-size: auto-clamp(12px, 18px);
            color: $color-red;
            font-weight: 400;
        }
    }
}
</style>
