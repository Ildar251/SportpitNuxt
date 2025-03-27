<script lang="ts" setup>
import type { ProductFull } from '@/types/product' // Импортируем тип ProductFull

const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchProducts()
})

const props = defineProps<{ filters?: boolean }>()

// Определяем варианты сортировки
const sortOptions = [
    { value: '', label: 'Без сортировки' },
    { value: 'price-asc', label: 'По возрастанию цены' },
    { value: 'price-desc', label: 'По убыванию цены' },
]

// Состояние для выбранного варианта сортировки
const selectedSort = ref('')

// Вычисляемое свойство для продуктов с учётом сортировки
const sortedProducts = computed(() => {
    let productsToSort: ProductFull[] = props.filters ? apiStore.filteredProducts : apiStore.products

    // Если сортировка не выбрана, возвращаем исходный массив
    if (!selectedSort.value) {
        return productsToSort
    }

    // Копируем массив, чтобы не мутировать оригинальный
    const sorted = [...productsToSort]

    // Сортировка в зависимости от выбранного варианта
    if (selectedSort.value === 'price-asc') {
        return sorted.sort((a, b) => {
            const priceA = a.price ? parseFloat(a.price) : 0
            const priceB = b.price ? parseFloat(b.price) : 0
            return priceA - priceB
        })
    } else if (selectedSort.value === 'price-desc') {
        return sorted.sort((a, b) => {
            const priceA = a.price ? parseFloat(a.price) : 0
            const priceB = b.price ? parseFloat(b.price) : 0
            return priceB - priceA
        })
    }

    return sorted
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
        <Card v-for="product in sortedProducts" :product="product" :key="product.id" />
    </div>
</template>

<style lang="scss" scoped>
.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 42px;

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
        font-weight: 500;
        color: #333;
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

.card-list--filters {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    flex: 1;
    margin-top: 0px;
}
</style>