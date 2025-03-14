<script setup lang="ts">
const props = defineProps<{
    data?: { info_logo?: string; info_bg?: string }
    page?: any
}>()
console.log('🔵 props:', props.page)

const config = useRuntimeConfig()
</script>

<template>
    <section class="section section-hero-2">
        <div class="container">
            <div class="hero" :style="`background-image: url(${config.public.apiUrl + page.tvFields?.info_bg});`">
                <h1 class="h1">{{ page.title }}</h1>
                <div class="brand__description">
                    <div class="text">
                        {{ page.description }}
                    </div>
                </div>
                <div class="brand__logo">
                    <NuxtImg :src="config.public.apiUrl + page.tvFields?.info_logo" :alt="page.title" />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.section-hero-2 {
    margin-top: auto-clamp(25px, 50px);
}

.hero {
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
