<script setup lang="ts">
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
        <div class="parallax-layer layer1" :style="{ transform: `translateY(${scrollY * 0.1}px)` }"></div>
        <div class="parallax-layer layer2" :style="{ transform: `translateY(${scrollY * 0.3}px)` }"></div>
        <div class="parallax-layer layer3" :style="{ transform: `translateY(${scrollY * 0.1}px)` }"></div>

        <div class="container">
            <h1 class="h1">Спортивное питание оптом</h1>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.section-hero {
    position: relative;
    height: 100vh;
    max-height: 640px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
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
    z-index: 4;
    width: 100%;
    padding: 74px 20px;

    .h1 {
        font-size: 100px;
        font-weight: 700;
        max-width: 520px;
    }
}
</style>