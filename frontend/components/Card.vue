<script lang="ts" setup>
interface Product {
    id: number
    title: string
    introtext: string
    content: string
    parent: number
    category: string | null
    alias: string
    uri: string
    price?: string
    brand?: string
    taste?: string
    sticker?: string
    image?: string
    volume?: string
}
const props = defineProps<{
    product: Product
}>()
const product = props.product


const config = useRuntimeConfig()

const isHovered = ref(false)


const stickers = computed(() => product.sticker ? product.sticker.split('||') : [])


const activeIndex = ref(0)
const volume = computed(() => product.volume ? product.volume.split('||') : [])
const onVolumeClick = (index: number) => {
    activeIndex.value = index
};

</script>

<template>
    <div :class="'card' + (isHovered ? ' card--hover' : '')" @mouseover="isHovered = true"
        @mouseleave="isHovered = false">
        <div class="card__image">
            <Transition name="fade">
                <div class="card__sticker" v-if="stickers && !isHovered">
                    <div v-for="sticker in stickers" :class="'card__sticker--item ' + sticker">
                        <NuxtIcon name="new" v-if="sticker === 'new'" />
                        <NuxtIcon name="hit" v-if="sticker === 'hit'" />
                        <NuxtIcon name="hit" v-if="sticker === 'sale'" />
                        <span>{{ sticker }}</span>
                    </div>
                </div>

            </Transition>
            <Transition name="fade">
                <div v-if="isHovered" class="card__favorite">
                    <NuxtIcon name="favorites" />
                </div>
            </Transition>
            <NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" loading="lazy" height="320" />
        </div>
        <div class="card__content">
            <div class="card__brand">{{ product?.brand || 'Товар' }}</div>
            <h3 class="card__title">{{ product.title }}</h3>
            <div class="card__taste">{{ product.taste }}</div>
            <span class="card__price">{{ product.price }} ₽</span>
            <Transition name="fade">
                <div class="card__hovered" v-if="isHovered">
                    <div class="card__volume">
                        <div :class="'card__volume--item' + (index === activeIndex ? ' card__volume--active' : '')"
                            v-for="(volume, index) in volume" :key="index" @click="onVolumeClick(index)">{{ volume }} мл
                        </div>
                    </div>

                    <div class="add-to-cart">
                        <span class="span-text">В корзину</span>
                        <NuxtIcon name="plus" />
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.card {
    @include flex(column, center, center);
    gap: 25px;
    padding: 20px;
    position: relative;
    transition: $transition;
    z-index: 1;

    &--hover {
        background-color: $color-light;
    }

    .card__volume {
        @include flex(row, flex-start, center);
        gap: 8px;
        transition: $transition;
        margin-top: 12px;

        &--item {
            background-color: $color-white;
            color: $color-primary;
            font-size: 14px;
            padding: 10px 12px;
            cursor: pointer;
            transition: $transition;

            &:hover {
                transform: translateY(-5px);
            }

            &.card__volume--active {
                background-color: $color-primary;
                color: $color-white;
            }
        }
    }

    .card__image {
        @include flex(column, flex-end, center);
        height: 320px
    }

    .card__sticker {
        @include flex(column, center, flex-start);
        gap: 6px;
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: auto-clamp(18px, 27px);
        font-weight: 700;


        &--item {
            @include flex(row, center, center);
            gap: 6px;
            padding: auto-clamp(8px, 12px) auto-clamp(16px, 27px);

            &.new {
                background-color: $color-orange;
                color: $color-white;
            }

            &.sale {
                background-color: $color-red;
                color: $color-white;
            }

            &.hit {
                background-color: $color-accent;
                color: $color-white;
            }
        }
    }

    .card__content {
        @include flex(column, flex-start, flex-start);
        width: 100%;
    }

    .card__taste {
        color: $color-primary;
        font-size: 18px;
        margin-bottom: 12px;
    }

    .card__brand {
        color: $color-gray;
        font-size: 12px;
        border-bottom: 2px solid $color-light;
        width: 100%;
        padding-bottom: 12px;
        font-weight: 600;
    }

    .card__title {
        color: $color-primary;
        font-size: 18px;
        font-weight: 700;
        margin-top: 12px;
    }

    .card__price {
        color: $color-gray;
        font-size: 18px;
    }

    .card__hovered {
        position: absolute;
        background-color: $color-light;
        bottom: -125px;
        left: 0;
        padding: 0 20px 20px;
        width: 100%;
    }

    .card__favorite {
        width: 55px;
        height: 55px;
        @include flex(row, center, center);
        position: absolute;
        right: 20px;
        top: 20px;
        border-radius: 50%;
        background-color: $color-white;
        cursor: pointer;
    }

    .add-to-cart {
        margin-top: 42px;
        @include flex(row, flex-end, center);
        width: 100%;
        gap: 4px;
        cursor: pointer;

        .span-text {
            transition: $transition;
        }


        &:hover {
            color: $color-accent;

            .nuxt-icon {
                transform: scale(1.3);
            }
        }
    }
}
</style>