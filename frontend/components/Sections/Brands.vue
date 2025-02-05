<script setup lang="ts">
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
            <NuxtLink :to="'/' + brand.alias" v-for="brand in brands" :key="brand.id" class="brands__item">
                <h3 class="h3 brands__title">{{ brand.title }}</h3>
                <div class="brands__logo">
                    <NuxtImg :src="config.public.apiUrl + brand.tvFields.brand_logo" :alt="brand.title" />
                </div>
            </NuxtLink>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.brands {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 400px));
    grid-template-rows: 400px;
    gap: 24px;
    margin-top: 42px;

    .brands__item {
        @include flex(column, flex-start, flex-start);
        padding: 20px;
        height: 100%;
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
        }
    }
}
</style>