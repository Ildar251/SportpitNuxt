<!-- components/Accordion.vue -->
<script lang="ts" setup>

const props = defineProps<{
    title: string
    content: string
}>()

const isOpen = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const maxHeight = ref('0px')
const shouldRender = ref(false) // Управляет рендерингом контента

const toggleAccordion = async () => {
    if (!isOpen.value) {
        shouldRender.value = true // Показываем контент перед анимацией
        await nextTick() // Ждем рендер
        if (contentRef.value) {
            maxHeight.value = `${contentRef.value.scrollHeight}px`
        }
    } else {
        if (contentRef.value) {
            maxHeight.value = '0px'
            setTimeout(() => {
                shouldRender.value = false // Скрываем контент после анимации
            }, 500) // Длительность анимации должна совпадать с CSS
        }
    }

    isOpen.value = !isOpen.value
}
</script>

<template>
    <div class="accordion">
        <button class="accordion__header" @click="toggleAccordion">
            <h3 class="h3">{{ title }}</h3>
            <Transition name="fade">
                <NuxtIcon :name="isOpen ? 'minus' : 'plus'" class="accordion__icon" />
            </Transition>
        </button>
        <div v-if="shouldRender" ref="contentRef" class="accordion__content" :style="{ maxHeight }">
            <p v-html="content"></p>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.accordion {
    border-top: 2px solid $color-border;
    padding: 16px 0;
    transition: $transition;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background: none;
        border: none;
        padding: 8px 0;
        cursor: pointer;
        font-weight: bold;
        text-align: left;

        &:hover {
            color: $color-primary;
        }

        .h3 {
            margin: 0;
            font-size: auto-clamp(16px, 24px);
        }
    }

    &__icon {
        font-size: 18px;
        color: $color-gray;
        transition: $transition;
    }

    &__content {
        font-size: auto-clamp(16px, 20px);
        line-height: 1.5;
        color: $color-gray;
        overflow: hidden;
        max-height: 0;
        padding: 0;
        transition: max-height 0.5s ease, padding 0.5s ease;
      font-family: Roboto;
    }

    &__content>p {
        margin: 0;
        padding: 16px 15%;

        @media (max-width: 768px) {
            padding: 16px 0;
        }
    }
}

.slide-accordion-enter-active,
.slide-accordion-leave-active {
    transition: max-height 0.5s ease, opacity 0.5s ease, transform 0.5s ease;
}

.slide-accordion-enter-from,
.slide-accordion-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.slide-accordion-enter-to,
.slide-accordion-leave-from {
    max-height: var(--content-height);
    opacity: 1;
    transform: translateY(0);
}
</style>