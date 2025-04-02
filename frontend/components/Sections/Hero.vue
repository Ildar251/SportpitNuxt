<script setup lang="ts">
import gsap from 'gsap'

defineProps<{ data?: { hero_text?: string; hero_image?: string } }>()

onMounted(() => {
    window.addEventListener("preloadComplete", () => {
        // Анимация для h1
        gsap.fromTo('.h1',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )

        // Анимация для btn-more
        gsap.fromTo('.btn-more',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
        )

        // Анимация для layer2
        gsap.fromTo('.layer2',
            { x: 100, y: 100, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.2 }
        )
    })
})
</script>

<template>
    <section class="section-hero">
        <div class="parallax-layer layer1"></div>
        <div class="parallax-layer layer2"></div>
        <div class="parallax-layer layer3"></div>

        <div class="container">
            <h1 class="h1">
                {{ data?.hero_text || 'Заголовок по умолчанию' }}
            </h1>

            <NuxtLink to="#catalog" class="btn btn-more">
                <span>Каталог товаров</span>
                <NuxtIcon name="arrow-right" />
            </NuxtLink>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.section-hero {
    @include flex(row, flex-start, flex-start);
    position: relative;
    height: calc(100svh - 120px);
    max-height: 640px;
    overflow: hidden;
    color: white;
}

.parallax-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    will-change: transform;
}

.layer1 {
    background-image: url('@/assets/images/HeroImage-1.jpg');
    z-index: 1;
    background-size: cover;

    @media screen and (max-width: 768px) {
        background-image: url('@/assets/images/HeroImage-1-mob.jpg');
    }
}

.layer2 {
    background-image: url('@/assets/images/HeroImage-2.png');
    z-index: 2;
    background-position: right -50px bottom -50px;

    @media screen and (max-width: 768px) {
        background-size: 100%;
        background-position: right -10px bottom -10px;
        background-image: url('@/assets/images/HeroImage-2-mob.png');
    }
}

.layer3 {
    background-image: url('@/assets/images/HeroImage-3.png');
    z-index: 3;
    background-position: right -50px bottom -50px;
    background-size: 50%;

    @media screen and (max-width: 768px) {
        background-position: right 0px bottom 0px;
        background-size: 100%;
        background-image: url('@/assets/images/HeroImage-3-mob.png');
    }
}

.container {
    @include flex(column, stretch, stretch);
    z-index: 4;
    width: 100%;
    padding-top: auto-clamp(37px, 74px);
    padding-bottom: auto-clamp(37px, 74px);
    height: 100%;

    .h1 {
        font-size: auto-clamp(60px, 100px);
        font-weight: 700;
        max-width: 520px;
        line-height: 1;
    }
}

.btn-more {
    color: $color-white;
    margin-top: auto;
    position: relative;
    justify-content: flex-start;

    &::before {
        content: '';
        display: block;
        position: absolute;
        top: -20px;
        left: 0;
        max-width: 540px;
        width: 100%;
        height: 2px;
        background-color: $color-white;
    }
}
</style>
