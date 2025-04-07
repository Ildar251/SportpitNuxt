<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiStore } from '~/stores/api'

const route = useRoute()
const router = useRouter()
const apiStore = useApiStore()

// Проверяем, находимся ли мы на странице бренда
const isBrandPage = computed(() => {
    return route.name === 'brand' || route.name?.toString().includes('brand')
})

// Получаем уникальные бренды и категории
const uniqueBrands = computed(() => apiStore.uniqueBrands)
const uniqueCategories = computed(() => apiStore.uniqueCategories)

// Выбранные бренды и категории
const selectedBrands = ref<string[]>([])
const selectedCategories = ref<string[]>([])

// Состояние для открытия/закрытия dropdown
const isBrandsOpen = ref(false)
const isCategoriesOpen = ref(false)

// Применяем фильтры
const applyFilters = () => {
    apiStore.setSelectedBrands(selectedBrands.value)
    apiStore.setSelectedCategories(selectedCategories.value)

    // Обновляем query-параметр в URL
    router.push({
        path: route.path,
        query: {
            ...route.query,
            category: selectedCategories.value.length > 0 ? selectedCategories.value[0] : undefined,
        },
    })
}

// Функция для переключения состояния dropdown
const toggleDropdown = (type: 'brands' | 'categories') => {
    if (type === 'brands') {
        isBrandsOpen.value = !isBrandsOpen.value
    } else if (type === 'categories') {
        isCategoriesOpen.value = !isCategoriesOpen.value
    }
}

// Синхронизация фильтров с query-параметрами
const syncFiltersFromQuery = () => {
    const categoryFromQuery = route.query.category
    if (typeof categoryFromQuery === 'string' && uniqueCategories.value.includes(categoryFromQuery)) {
        selectedCategories.value = [categoryFromQuery]
        isCategoriesOpen.value = true // Открываем dropdown категорий
        applyFilters() // Применяем фильтр
    } else if (!categoryFromQuery) {
        selectedCategories.value = []
        apiStore.setSelectedCategories([])
    }
}

// Загружаем фильтры при монтировании
onMounted(async () => {
    if (!apiStore.products.length) {
        await apiStore.fetchProducts()
    }
    syncFiltersFromQuery()
})

// Реагируем на изменения query-параметров
watch(
    () => route.query.category,
    (newCategory) => {
        syncFiltersFromQuery()
    },
    { immediate: true } // Вызываем сразу при инициализации
)

// Синхронизируем query-параметр с выбранными категориями
watch(selectedCategories, (newCategories) => {
    router.push({
        path: route.path,
        query: {
            ...route.query,
            category: newCategories.length > 0 ? newCategories[0] : undefined,
        },
    })
})
</script>

<template>
    <div class="catalog-filter">
        <div class="catalog-filter__title">Фильтры</div>

        <!-- Показываем фильтр по брендам только если мы НЕ на странице бренда -->
        <div v-if="!isBrandPage" class="catalog-filter__wrapper">
            <div class="catalog-filter__item-head" @click="toggleDropdown('brands')">
                <h3 class="catalog-filter__item-title">Бренд</h3>
                <div :class="'icon' + (isBrandsOpen ? ' is-active' : '')"></div>
            </div>
            <Transition name="dropdown">
                <ul v-if="isBrandsOpen" class="catalog-filter__list">
                    <li v-for="brand in uniqueBrands" :key="brand" class="catalog-filter__item">
                        <label class="catalog-filter__label">
                            <input type="checkbox" :value="brand" v-model="selectedBrands" @change="applyFilters" />
                            {{ brand }}
                        </label>
                    </li>
                </ul>
            </Transition>
        </div>

        <div class="catalog-filter__item">
            <div class="catalog-filter__item-head" @click="toggleDropdown('categories')">
                <h3 class="catalog-filter__item-title">Категория</h3>
                <div :class="'icon' + (isCategoriesOpen ? ' is-active' : '')"></div>
            </div>
            <Transition name="dropdown">
                <ul v-if="isCategoriesOpen" class="catalog-filter__list">
                    <li v-for="category in uniqueCategories" :key="category" class="catalog-filter__item">
                        <label class="catalog-filter__label">
                            <input type="checkbox" :value="category" v-model="selectedCategories"
                                @change="applyFilters" />
                            {{ category }}
                        </label>
                    </li>
                </ul>
            </Transition>
        </div>
    </div>
</template>
<style scoped lang="scss">
.catalog-filter {
    margin-bottom: 20px;
    min-width: 20%;
    position: sticky;
    top: 80px;
    background-color: $color-white;
    z-index: 13;

    @media screen and (max-width: 768px) {
        width: calc(100% + 68px);
        top: 40px;
        margin-left: -24px;
        margin-right: -24px;
        padding: 0px 24px;
    }
}

.catalog-filter__item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-bottom: 2px solid $color-border;
    padding-bottom: 13px;
}

.catalog-filter__item-head .icon {
    width: 18px;
    height: 2.25px;
    background-color: $color-gray;
    border-radius: 1px;
    position: relative;

    &::before {
        content: '';
        display: block;
        width: 18px;
        height: 2.25px;
        background-color: $color-gray;
        border-radius: 1px;
        transform: rotate(90deg);
        position: absolute;
        transition: $transition;
    }

    &.is-active {
        &::before {
            transform: rotate(0deg);
        }
    }
}

.catalog-filter__section {
    margin-bottom: 20px;
}

.catalog-filter__title {
    font-size: auto-clamp(20px, 26px);
    padding: 24px 0;
    margin-bottom: 24px;
    color: $color-gray;
    width: 100%;
    border-right: 2px solid $color-border;
    height: auto-clamp(60px, 120px);
    font-weight: 700;

    @media screen and (max-width: 768px) {
        border-right: 0;
    }
}

.catalog-filter__list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    margin-top: 20px;
}

.catalog-filter__wrapper {
    margin-bottom: auto-clamp(30px, 60px);
}

.catalog-filter__item {
    margin-bottom: 8px;
}

.catalog-filter__label {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $color-gray;
}

.catalog-filter__label input {
    margin-right: 8px;
}

.catalog-filter__item-title {
    font-size: auto-clamp(18px, 24px);
    cursor: pointer;
    user-select: none;
}
</style>