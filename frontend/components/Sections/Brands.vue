<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
defineProps<{ data?: { brands_title?: string } }>()

const config = useRuntimeConfig()

const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchBrands()
})

const brands = computed(() => apiStore.brands)

</script>

<template>
    <section class="section section-brands">
        <div class="container line-top">
            <div class="section__header">
                <h2 class="h2">{{ data?.brands_title || 'Бренды' }}</h2>

                <NuxtLink to="/catalog" class="btn btn-more">
                    <span>Смотреть все</span>
                    <NuxtIcon name="arrow-right" />
                </NuxtLink>
            </div>
        </div>

        <div class="container brands">
            <Swiper :modules="[Pagination, Autoplay]"
                :breakpoints="{ 512: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1440: { slidesPerView: 4 } }"
                :spaceBetween="20" :slidesPerView="1.4" :pagination="{ clickable: true }"
                :autoplay="{ delay: 2500, disableOnInteraction: false }" :speed="1000" class="brands-slider">
                <SwiperSlide v-for="brand in brands" :key="brand.id" class="brands__item">
                    <h3 class="h3 brands__title">{{ brand.title }}</h3>
                    <div class="brands__logo">
                        <NuxtImg :src="config.public.apiUrl + brand.tvFields.brand_logo" :alt="brand.title" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.brands {
    margin-top: 42px;

    .swiper {
        overflow: visible !important
    }

    .brands__item {
        @include flex(column, flex-start, flex-start);
        padding: 20px;
        aspect-ratio: 1 / 1;
        background-color: $color-light;
        transition: $transition;

        &:hover {
            background-color: $color-primary;
            color: $color-white;

            .brands__title {
                color: $color-white;
            }

            .brands__logo {
                filter: brightness(0) invert(1);
            }
        }

        .brands__title {
            font-size: 24px;
            font-weight: 700;
            color: $color-primary;
            border-bottom: 2px solid $color-border;
            width: 100%;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .brands__logo {
            margin-top: auto;

            @media screen and (max-width: 768px) {
                max-width: 50%;
            }
        }
    }
}
</style>