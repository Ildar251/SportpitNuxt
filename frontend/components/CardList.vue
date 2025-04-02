<script lang="ts" setup>
import type { ProductFull } from '@/types/product'
import 'swiper/css'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useApiStore } from '~/stores/api'

const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchProducts()
})

const props = defineProps<{ filters?: boolean }>()


const sortOptions = [
    { value: '', label: 'Без сортировки' },
    { value: 'price-asc', label: 'По возрастанию цены' },
    { value: 'price-desc', label: 'По убыванию цены' },
]

const selectedSort = ref('')

const sortedProducts = computed(() => {
    let productsToSort: ProductFull[] = props.filters ? apiStore.filteredProducts : apiStore.products

    if (!selectedSort.value) {
        return productsToSort.slice(0, 10)
    }

    const sorted = [...productsToSort]

    if (selectedSort.value === 'price-asc') {
        return sorted
            .sort((a, b) => {
                const priceA = a.price ? parseFloat(a.price) : 0
                const priceB = b.price ? parseFloat(b.price) : 0
                return priceA - priceB
            })
            .slice(0, 10)
    } else if (selectedSort.value === 'price-desc') {
        return sorted
            .sort((a, b) => {
                const priceA = a.price ? parseFloat(a.price) : 0
                const priceB = b.price ? parseFloat(b.price) : 0
                return priceB - priceA
            })
            .slice(0, 10)
    }

    return sorted.slice(0, 10)
})

// Проверка ширины экрана для переключения на слайдер
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    window.addEventListener('resize', updateIsMobile)
    updateIsMobile()
})

onUnmounted(() => {
    window.removeEventListener('resize', updateIsMobile)
})
</script>

<template>
    <div v-if="apiStore.loading">Загрузка...</div>
    <div :class="'card-list' + (filters ? ' card-list--filters' : '')" v-else v-auto-animate>
        <div class="catalog-sort" v-if="filters">
            <label for="sort-select" class="sort-label">Сортировать:</label>
            <select id="sort-select" v-model="selectedSort" class="sort-select">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>


        <Swiper v-if="isMobile" :modules="[Pagination]" :slidesPerView="1.2" :spaceBetween="0"
            :pagination="{ clickable: true }" class="card-slider">
            <SwiperSlide v-for="product in sortedProducts" :key="product.id">
                <Card :product="product" />
            </SwiperSlide>
        </Swiper>


        <div v-else class="card-grid">
            <Card v-for="product in sortedProducts" :key="product.id" :product="product" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card-list {
    margin-top: 42px;
    position: relative;
    z-index: 12;

    .catalog-sort {
        grid-column: 1 / -1;
        @include flex(row, flex-start, flex-start);
        gap: 12px;
        height: auto-clamp(60px, 120px);
        padding-top: 30px;
    }

    .sort-label {
        font-weight: 700;
        font-size: 18px;
        color: $color-gray;
    }

    .sort-select {
        border: none;
        background-color: #fff;
        cursor: pointer;
        transition: border-color 0.3s;
        font-weight: 700;
        font-size: 18px;

        &:hover {
            border-color: #aaa;
        }

        &:focus {
            outline: none;
            border-color: #666;
        }
    }
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.card-slider {
    padding-bottom: 40px;
    overflow: visible;
}

.card-list--filters {
    .card-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    flex: 1;
    margin-top: 0px;
}
</style>