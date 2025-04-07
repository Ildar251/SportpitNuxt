<script setup lang="ts">
const props = defineProps<{ page?: any }>()
const config = useRuntimeConfig()

// Вычисляемые свойства для SEO данных
const seoSubtitle = computed(() => props.page?.tvFields?.seo_subtitle || 'Энергетики')
const seoTitle = computed(() => props.page?.tvFields?.seo_title || 'Seo описание в несколько строк')
const seoText = computed(() => props.page?.tvFields?.seo_text || '')

// Обработка seo_images как массива
const seoImages = computed(() => {
    try {
        return props.page?.tvFields?.seo_images
            ? JSON.parse(props.page.tvFields.seo_images)
            : []
    } catch (error) {
        console.error('❌ Ошибка парсинга seo_images:', error)
        return []
    }
})
</script>

<template>
    <section class="section section-seo">
        <div class="container">
            <div class="seo">
                <div class="seo__left">
                    <div class="seo__subtitle">{{ seoSubtitle }}</div>
                    <h2 class="h2 seo__title">{{ seoTitle }}</h2>
                </div>
                <div class="seo__text" v-html="seoText"></div>
                <div class="seo__images" v-if="seoImages.length">
                    <NuxtImg v-for="image in seoImages" :key="image.MIGX_id" :src="config.public.apiUrl + image.img"
                        :alt="image.alt" sizes="400px" loading="lazy" />
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped>
.seo {
    display: grid;
    grid-template-columns: 1.2fr 2fr 1.2fr;
    border-top: 2px solid $color-border;
    gap: auto-clamp(20px, 42px);

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }

    &>div {
        padding-top: auto-clamp(28px, 42px);
    }

    .seo__subtitle {
        font-size: auto-clamp(20px, 26px);
        color: $color-gray;
    }

    .seo__title {
        font-size: auto-clamp(28px, 42px);
        margin-top: 24px;
        padding-right: 20px;
    }

    .seo__text {
        position: relative;
        font-size: auto-clamp(16px, 18px);
        color: $color-gray;
        letter-spacing: 0;
        padding-right: auto-clamp(0px, 90px);
      font-family: Roboto;



        &::before {
            content: '';
            display: block;
            width: 2px;
            height: 200px;
            background-color: $color-border;
            position: absolute;
            top: 0;
            left: calc(auto-clamp(20px, 42px) * -1);
        }
    }

    .seo__images {
        @include flex(column, flex-start, flex-start);
        gap: auto-clamp(12px, 24px);
        width: 100%;

        @media screen and (max-width: 768px) {
            flex-direction: row;
            padding-top: 0;

            img {
                width: calc(50% - auto-clamp(6px, 12px));
            }
        }
    }
}
</style>