<script setup lang="ts">
defineProps<{ data?: { hero_text?: string; hero_image?: string } }>()

const scrollY = ref(0)

const handleScroll = () => {
    scrollY.value = window.scrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <section class="section-hero">
        <div class="parallax-layer layer1" :style="{ transform: `translateY(${scrollY * 0.2}px)` }"></div>
        <div class="parallax-layer layer2" :style="{ transform: `translateX(${scrollY * 0.1}px)` }"></div>
        <div class="parallax-layer layer3" :style="{ transform: `translateY(${scrollY * 0.1}px)` }"></div>

        <div class="container" :style="{ transform: `translate(${scrollY * -0.2}px, ${scrollY * -0.05}px)` }">
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
    height: 100vh;
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
}

.layer2 {
    background-image: url('@/assets/images/HeroImage-2.png');
    z-index: 2;
    background-position: right -50px bottom -50px;
}

.layer3 {
    background-image: url('@/assets/images/HeroImage-3.png');
    z-index: 3;
    background-position: right -50px bottom -50px;
    background-size: 50%;
}

.container {
    @include flex(column, stretch, stretch);
    z-index: 4;
    width: 100%;
    padding: 74px 20px;
    height: 100%;


    .h1 {
        font-size: 100px;
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