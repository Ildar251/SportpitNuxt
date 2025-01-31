<script setup lang="ts">
const props = defineProps<{ data?: { advantages_items?: string } }>()
const config = useRuntimeConfig()

// Парсим JSON, если поле существует
const advantages = computed(() => {
    try {
        return props.data?.advantages_items ? JSON.parse(props.data.advantages_items) : []
    } catch (error) {
        console.error('❌ Ошибка парсинга MIGX-поля advantages_items:', error)
        return []
    }
})
console.log(advantages);

</script>

<template>
    <section class="section section-advantages" v-if="advantages.length">
        <div class="container advantage">
            <div v-for="item in advantages" :key="item.MIGX_id" class="advantage__item">
                <NuxtImg :src="config.public.apiUrl + item.image" :alt="item.title" class="advantage__image" />
                <h3 class="advantage__title">{{ item.title }}</h3>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.advantage {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1570px;

    .advantage__item {
        display: flex;
        align-items: center;
        gap: 24px;
        position: relative;

        &::before {
            content: '';
            display: block;
            width: 24px;
            height: 24px;
            background-image: url('@/assets/images/star.svg');
            position: absolute;
        }

        &:nth-child(1)::before {
            top: -20px;
            left: 30%;
        }

        &:nth-child(2)::before {
            bottom: -20px;
            left: 30%;
        }

        &:nth-child(3)::before {
            top: -20px;
            left: -20px;
        }

        &:nth-child(4)::before {
            bottom: 0px;
            right: 20px;
        }

        .advantage__title {
            max-width: auto-clamp(120px, 240px);
            font-size: auto-clamp(16px, 24px);
            font-weight: 700;
        }
    }
}
</style>
