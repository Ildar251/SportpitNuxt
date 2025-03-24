<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApiStore } from '~/stores/api'
import { useCartStore } from '~/stores/cartStore'
import { useFavoriteStore } from '~/stores/favoritesStore'

const modalStore = useModalStore()
const route = useRoute()
const apiStore = useApiStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const config = useRuntimeConfig()
const authStore = useAuthStore()



import type { ProductFull } from '@/types/product'

// Загрузка данных о продукте
const product = ref<ProductFull | null>(null)
const stickers = computed(() => (product.value?.sticker ? product.value.sticker.split('||') : []))

onMounted(async () => {
    if (apiStore.products.length === 0) {
        await apiStore.fetchProducts()
    }
    if (apiStore.brands.length === 0) {
        await apiStore.fetchBrands()
    }
    product.value = apiStore.products.find(p => p.alias === route.params.alias) || null

    if (!product.value) {
        console.error(`Продукт с alias "${route.params.alias}" не найден`)
    }
})

// Обработка объема
const activeIndex = ref(0)
const volume = computed(() => (product.value?.volume ? product.value.volume.split('||') : []))
const onVolumeClick = (index: number) => {
    activeIndex.value = index
}

// Добавление в корзину
const addToCart = () => {
    if (product.value) {
        cartStore.addToCart({
            id: product.value.id,
            title: product.value.title,
            price: product.value.price ? parseFloat(product.value.price) : 0,
            image: product.value.image,
            volume: volume.value[activeIndex.value] ? parseInt(volume.value[activeIndex.value]) : 0,
            quantity: 1,
        })
    }
}

// Удаление из корзины
const removeFromCart = () => {
    if (product.value) {
        cartStore.removeFromCart(product.value.id)
    }
}

// Переключение избранного
const toggleFavorite = () => {
    if (product.value) {
        favoriteStore.toggleFavorite({
            id: product.value.id,
            title: product.value.title,
            price: product.value.price ? parseFloat(product.value.price) : 0,
            image: product.value.image,
            volume: volume.value[activeIndex.value] ? parseInt(volume.value[activeIndex.value]) : 0,
        })
    }
}

// Увеличение количества
const increaseQuantity = () => {
    if (product.value) {
        const currentQuantity = cartStore.getQuantity(product.value.id)
        cartStore.updateQuantity(product.value.id, currentQuantity + 1)
    }
}

// Уменьшение количества
const decreaseQuantity = () => {
    if (product.value) {
        const currentQuantity = cartStore.getQuantity(product.value.id)
        cartStore.updateQuantity(product.value.id, currentQuantity - 1)
    }
}
// Проверка, есть ли товар в корзине, и получение количества
const isInCart = computed(() => (product.value ? cartStore.isInCart(product.value.id) : false))
const cartQuantity = computed(() =>
    product.value ? cartStore.getQuantity(product.value.id) : 0
)

const textRef = ref<HTMLElement | null>(null)
const isTextExpanded = ref(false)
const isTextLong = ref(false)

// Динамическая высота для анимации
const textHeight = ref('200px') // Начальная высота совпадает с CSS

const toggleText = async () => {
    if (!textRef.value) return

    const fullHeight = `${textRef.value.scrollHeight}px`
    if (!isTextExpanded.value) {
        // Раскрытие
        textHeight.value = fullHeight
        isTextExpanded.value = true
    } else {
        // Скрытие
        textHeight.value = '200px'
        isTextExpanded.value = false
    }
}

onMounted(async () => {
    await nextTick() // Ждем рендера DOM
    if (textRef.value) {
        isTextLong.value = textRef.value.scrollHeight > 200
    }
})

const activeTasteIndex = ref(0)
const tastes = computed(() => product.value?.taste || [])
const onTasteClick = (index: number) => {
    activeTasteIndex.value = index
}


const accordions = [
    {
        title: 'Рекомендации по применению',
        content: '', // Пусто, как на скриншоте
    },
    {
        title: 'Состав',
        content:
            'Плотнотечная вода вышей категории, BCAA (L - Валин, L - Изолейцин, L - Лейцин), Висовая катерная, Вещества натура, L - Сукроза, Цитрат натрия, Лимонная кислота, Ароматизатор грейпфрут',
    },
    {
        title: 'Условия хранения',
        content: '', // Пусто, как на скриншоте
    },
]
</script>

<template>
    <main>
        <section class="section section-product" v-if="product">
            <div class="container product">
                <div class="product__image">
                    <NuxtImg :src="config.public.apiUrl + tastes[activeTasteIndex].image" :alt="product.title"
                        height="420" loading="lazy" />
                    <Transition name="fade">
                        <div class="card__sticker" v-if="stickers">
                            <div v-for="sticker in stickers" :class="'card__sticker--item ' + sticker">
                                <NuxtIcon name="new" v-if="sticker === 'new'" />
                                <NuxtIcon name="hit" v-if="sticker === 'hit'" />
                                <NuxtIcon name="hit" v-if="sticker === 'sale'" />
                                <span>{{ sticker }}</span>
                            </div>
                        </div>
                    </Transition>

                    <div :class="'favorite' +
                        (favoriteStore.isFavorite(product.id) ? ' favorite--active' : '')"
                        @click.stop="toggleFavorite">
                        <NuxtIcon name="favorites" />
                    </div>
                </div>
                <div class="product__info">
                    <div class="container breadcrumbs">
                        <NuxtLink to="/" class="breadcrumbs__item">Главная страница</NuxtLink>
                        <NuxtLink to="/catalog" class="breadcrumbs__item">Продукты</NuxtLink>
                        <div class="breadcrumbs__item">{{ product?.title }}</div>
                    </div>
                    <NuxtLink to="#" class="product__brand link">
                        {{ product.brand || 'Без бренда' }}
                    </NuxtLink>
                    <div class="product__info-main">
                        <div class="product__info-left">
                            <h1 class="h1">{{ product.title }} {{ tastes[activeTasteIndex].taste }}</h1>
                            <div class="product__text-block" v-if="product.product_text">
                                <div ref="textRef" class="product__text"
                                    :class="{ 'product__text--collapsed': !isTextExpanded && isTextLong }"
                                    :style="{ maxHeight: textHeight }" v-html="product.product_text"></div>
                                <button v-if="isTextLong" class="btn btn-more-down"
                                    :class="{ 'more--open': isTextExpanded }" @click="toggleText">
                                    <span>{{ isTextExpanded ? 'Скрыть' : 'Полное описание' }}</span>
                                    <NuxtIcon name="arrow-down" />
                                </button>
                            </div>
                        </div>
                        <div class="product__info-right">
                            <div :class="'product__info-favorite favorite' +
                                (favoriteStore.isFavorite(product.id) ? ' favorite--active' : '')"
                                @click.stop="toggleFavorite">
                                <NuxtIcon name="favorites" />
                            </div>
                        </div>
                    </div>

                    <div class="product__volume product__info-block">
                        <h3 class="h3">Объём</h3>
                        <div class="row">
                            <div :class="'product__volume-item' +
                                (index === activeIndex ? ' product__volume-item--active' : '')"
                                v-for="(vol, index) in volume" :key="index" @click="onVolumeClick(index)">
                                {{ vol }} мл
                            </div>
                        </div>
                    </div>

                    <div class="product__taste product__info-block" v-if="tastes.length">
                        <h3 class="h3">Вкус</h3>
                        <Swiper :modules="[Pagination, Autoplay]" :breakpoints="{
                            320: { slidesPerView: 2.5 },
                            512: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1440: { slidesPerView: 6 },
                        }" :spaceBetween="20" :slidesPerView="1.4" :pagination="{ clickable: true }" :speed="1000"
                            class="taste-slider">
                            <SwiperSlide v-for="(taste, index) in tastes" :key="taste.MIGX_id" class="taste__item"
                                :class="{ 'taste__item--active': index === activeTasteIndex }"
                                @click="onTasteClick(index)">
                                <div class="taste__image">
                                    <NuxtImg :src="config.public.apiUrl + taste.image" :alt="taste.taste" height="120"
                                        width="auto" format="webp" />
                                </div>

                                <div class="taste__text">
                                    {{ taste.taste }}
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    <div class="product__bottom">
                        <div class="row">
                            <div class="product__price">
                                <div v-if="authStore.apiToken">
                                    <span class="price">{{ product.price }} ₽</span>
                                    <span class="price__subtext">Оптовая цена</span>
                                </div>
                                <div v-else>
                                    <span class="price-old">{{ product.price_old }} ₽</span>
                                    <span class="price__subtext">Без регистрации</span>
                                </div>
                            </div>

                            <Transition name="fade">
                                <button v-if="!isInCart" class="btn add-to-cart" @click.stop="addToCart">
                                    <span class="span-text">В корзину</span>
                                    <NuxtIcon name="plus" />
                                </button>
                                <div v-else class="row">
                                    <div class="cart-controls">
                                        <button class="btn qty-btn" @click.stop="decreaseQuantity">
                                            <NuxtIcon name="minus" />
                                        </button>
                                        <span class="cart-quantity">{{ cartQuantity }}</span>
                                        <button class="btn qty-btn" @click.stop="increaseQuantity">
                                            <NuxtIcon name="plus" />
                                        </button>
                                    </div>
                                    <button class="btn delete-from-cart" @click.stop="removeFromCart">
                                        <span>Удалить из корзины</span>
                                        <NuxtIcon name="delete" />
                                    </button>
                                </div>
                            </Transition>
                        </div>

                        <div class="dop-info" v-if="!authStore.apiToken">
                            <div class="lock">
                                <NuxtIcon name="lock" />
                                <span class="h4">Стоимость
                                    оптовой закупки</span>
                            </div>
                            <div class="product__price-info">
                                <div class="minimal">
                                    Минимальная сумма<br>заказа 10 000 ₽
                                </div>
                                <div class="warning">
                                    <NuxtIcon name="warning" />
                                    <div>
                                        <span>Чтобы узнать оптовую стоимость, зарегистрируйтесь на сайте</span>
                                        <div class="btn btn-more" @click.prevent="modalStore.open">
                                            <span>Зарегистрироваться</span>
                                            <NuxtIcon name="arrow-right" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="minimal" v-else>
                            Минимальная сумма заказа 10 000 ₽
                        </div>

                    </div>

                    <div class="product__data product__info-block">
                        <div class="column">
                            <h4 class="h4">Сахар</h4>
                            <span>0г</span>
                        </div>
                        <div class="column">
                            <h4 class="h4">Эн. ценность</h4>
                            <span>32 Ккал</span>
                        </div>
                        <div class="column">
                            <div class="row">
                                <h4 class="h4">Protein</h4>
                                <span>8 г</span>
                            </div>
                            <div class="row">
                                <h4 class="h4">Protein</h4>
                                <span>8 г</span>
                            </div>
                        </div>
                    </div>

                    <div class="accordions">
                        <UiAccordion v-for="(accordion, index) in accordions" :key="index" :title="accordion.title"
                            :content="accordion.content" />
                    </div>

                </div>
            </div>
        </section>
        <section v-else class="section section-product">
            <div class="container">
                <div class="not-found">Продукт не найден</div>
            </div>
        </section>

        <div class="box">
        </div>
    </main>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .section-product {
        margin-top: 0px
    }
}

.product {
    @include flex(row, space-between, flex-start);
    gap: auto-clamp(32px, 64px);

    @media screen and (max-width: 768px) {
        @include flex(column, center, center);

    }

    .breadcrumbs {
        margin: 0;
        padding: 0;
        margin-bottom: 80px;

        @media screen and (max-width: 768px) {
            margin-bottom: 20px;
        }
    }

    .h1 {
        font-size: auto-clamp(28px, 50px);
        font-weight: 700;

        @media screen and (max-width: 768px) {
            box-shadow: 0px 0px 0px 20px $color-light;
            background-color: $color-light;
        }
    }

    .product__image {
        @include flex(row, center, center);
        background-color: $color-light;
        padding: auto-clamp(40px, 80px);
        width: 100%;
        max-width: auto-clamp(290px, 580px);
        position: sticky;
        top: 100px;

        .favorite {
            display: none;
        }

        @media screen and (max-width: 768px) {
            max-width: 100%;
            padding: 30px 30px 0 30px;
            box-shadow: 0px 0px 0px 160px $color-light;
            position: relative;
            top: 0;

            .favorite {
                display: flex;
                position: absolute;
                top: 20px;
                right: 0px;
            }

            img {
                max-height: 300px
            }
        }
    }

    .card__sticker {
        @media screen and (max-width: 768px) {
            left: 0px;
        }
    }

    .taste-slider {
        width: 100%;
        overflow: visible !important;
        margin-top: 24px;
        margin-bottom: 50px;

        .taste__item {
            cursor: pointer;

            &:hover {
                .taste__image {
                    box-shadow: 0 4px 12px rgb(144, 210, 109, 0.5);
                }
            }

            .taste__image {
                @include flex(row, center, center);
                transition: $transition;
                height: 116px;
                background-color: $color-light;
                padding-top: 20px;
                overflow: clip;
                border: 5px solid transparent;

                img {
                    object-fit: contain;
                    object-position: 0 20px;
                }
            }

            .taste__text {
                margin-top: 7px;
                font-size: 14px;
                color: $color-gray;
            }

            &--active {
                .taste__image {
                    border: 5px solid $color-accent;
                }
            }
        }
    }

    .lock {
        @include flex(column, flex-start, flex-start);
        color: $color-gray;
        font-weight: bold;

        .nuxt-icon {
            font-size: 40px;
        }

        span:not(.nuxt-icon) {
            font-size: 20px;
            max-width: 160px;
            line-height: 1;
            margin-top: 8px;
        }
    }

    .product__info {
        position: relative;
        width: calc(100% - auto-clamp(290px, 580px));

        @media screen and (max-width: 768px) {
            width: 100%;
        }

        .product__brand {
            color: $color-gray;
            font-size: 12px;
            font-weight: 600;
        }

        .product__text-block {
            margin-top: 32px;
            margin-bottom: 20px;

            @media screen and (max-width: 768px) {
                margin-top: 72px;
            }

            .product__text {
                font-size: 16px;
                line-height: 1.5;
                color: $color-gray;
                transition: max-height 0.5s ease;
                overflow: hidden;

                &--collapsed {
                    position: relative;

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 50px;
                        background: linear-gradient(transparent, $color-white 90%);
                        pointer-events: none;
                    }
                }

                :deep(p) {
                    margin-bottom: 15px;
                }
            }
        }

        .product__info-main {
            @include flex(row, space-between, flex-start);
            gap: 16px;
            border-top: 2px solid $color-border;
            margin-top: 16px;

            @media screen and (max-width: 768px) {
                border: none;
                gap: 0;
            }

            .h1 {
                padding-top: 24px;

                @media screen and (max-width: 768px) {
                    padding-top: 0;
                }
            }

            .product__info-right {
                @include flex(row, flex-end, center);
                min-width: 15%;
                border-left: 2px solid $color-border;
                padding-top: 24px;

                @media screen and (max-width: 768px) {
                    display: none;
                }
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
        display: flex;
        align-items: flex-end;
        font-size: auto-clamp(32px, 70px);
        font-weight: 700;
        white-space: nowrap;

        span {
            display: block;
            line-height: 1;

            &.price__subtext {
                font-size: auto-clamp(16px, 20px);
                color: $color-gray;
            }
        }

        &-info {
            @include flex(row, space-between, center);
            background-color: #FCFCFC;
            padding: 12px 40px;
            gap: 30px;
            font-size: 18px;

            .minimal {
                color: $color-red;
            }

            .warning {
                flex: 1;
                @include flex(row, space-between, flex-start);
                gap: 12px;
                max-width: 360px;

                .btn-more {
                    margin-top: 10px;
                    color: $color-accent;
                }
            }
        }
    }

    .minimal {
        @include flex(row, flex-end, center);
        margin-left: auto;
        color: $color-red;
        font-size: 18px;
        margin-top: 32px;
    }

    .btn {
        margin-top: 0;
    }

    .product__bottom {
        margin-top: auto-clamp(32px, 72px);
        padding-top: auto-clamp(32px, 72px);
        border-top: 2px solid $color-border;



        &>.row {
            @include flex(row, space-between, stretch);
            flex-wrap: wrap;
            gap: 20px;

            @media screen and (max-width: 768px) {
                .product__price {
                    width: 100%;
                }
            }
        }

        .row {
            flex: 1
        }

        .dop-info {
            @include flex(row, space-between, flex-start);
            margin-top: 42px;
        }
    }

    .cart-controls {
        @include flex(row, space-between, center);
        background-color: #F1F3F6;
        padding: auto-clamp(14px, 21px) auto-clamp(20px, 27px);
        gap: auto-clamp(22px, 42px);
        font-size: auto-clamp(16px, 26px);
        margin-right: 20px;
    }

    .product__data {
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        .column {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .h4 {
                color: $color-gray;
                font-weight: 400;
                font-size: auto-clamp(14px, 16px);
            }

            span {
                display: block;
                margin-top: 16px;
                font-size: auto-clamp(20px, 40px);
                font-weight: 700;
            }

            .row {
                margin-top: 0;

                span {
                    margin-top: 0;
                    font-size: auto-clamp(14px, 16px);
                }
            }
        }
    }

    .accordions {

        margin-top: auto-clamp(32px, 64px);

    }
}
</style>
