<script setup lang="ts">
import { useApiStore } from '@/stores/api'

const route = useRoute()
const apiStore = useApiStore()
const brandAlias = computed(() => route.params.brand)
const config = useRuntimeConfig()
const { sections, sectionMap, sectionsData, page } = usePage('brands')
// Получаем бренд по alias
const brand = computed(() => {
    return apiStore.brands.find((b) => b.alias === brandAlias.value)
})

// Если брендов нет, загружаем их
onMounted(() => {
    if (!apiStore.brands.length) {
        apiStore.fetchBrands()
    }
})
</script>

<template>
    <main>
        <section class="section section-brand">
            <div class="container">
                <div v-if="brand" class="brand-hero"
                    :style="`background-image: url(${config.public.apiUrl + brand.tvFields.brand_bg});`">
                    <h1 class="h1">{{ brand.title }}</h1>
                    <div class="brand__description">
                        <div class="text">
                            {{ brand.description }}
                        </div>
                    </div>
                    <div class="brand__logo">
                        <NuxtImg :src="config.public.apiUrl + brand.tvFields.brand_logo" :alt="brand.title" />
                    </div>
                </div>
            </div>
        </section>
        <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]"
            :page="page" :noInfoTitle="true" />

        <SectionsSeo />
    </main>
</template>


<style lang="scss" scoped>
.section-brand {
    margin-top: auto-clamp(25px, 50px);
}

.brand-hero {
    padding: auto-clamp(30px, 72px);
    color: $color-white;
    min-height: auto-clamp(300px, 560px);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: $color-primary;

    .h1 {
        font-size: auto-clamp(80px, 140px);
    }

    .brand__description {
        font-size: auto-clamp(14px, 16px);

        margin: auto-clamp(20px, 40px) 0;
        padding: auto-clamp(20px, 40px) 0;
        width: 100%;
        border-top: 2px solid $color-border;

        .text {
            max-width: 700px;
        }
    }

    .brand__logo {
        filter: brightness(0) invert(1);
    }
}
</style>