<script setup lang="ts">
import { useApiStore } from '~/stores/api'

const apiStore = useApiStore()

// Получаем уникальные бренды и категории
const uniqueBrands = computed(() => apiStore.uniqueBrands)
const uniqueCategories = computed(() => apiStore.uniqueCategories)

// Выбранные бренды и категории
const selectedBrands = ref<string[]>([])
const selectedCategories = ref<string[]>([])

// Применяем фильтры
const applyFilters = () => {
    apiStore.setSelectedBrands(selectedBrands.value)
    apiStore.setSelectedCategories(selectedCategories.value)
}
</script>


<template>
    <div class="catalog-filter">
        <div class="catalog-filter__title">Фильтры</div>
        <div class="catalog-filter__item">
            <h3 class="catalog-filter__item-title">Бренд</h3>
            <ul class="catalog-filter__list">
                <li v-for="brand in uniqueBrands" :key="brand" class="catalog-filter__item">
                    <label class="catalog-filter__label">
                        <input type="checkbox" :value="brand" v-model="selectedBrands" @change="applyFilters" />
                        {{ brand }}
                    </label>
                </li>
            </ul>
        </div>

        <div class="catalog-filter__item">
            <h3 class="catalog-filter__item-title">Категория</h3>
            <ul class="catalog-filter__list">
                <li v-for="category in uniqueCategories" :key="category" class="catalog-filter__item">
                    <label class="catalog-filter__label">
                        <input type="checkbox" :value="category" v-model="selectedCategories" @change="applyFilters" />
                        {{ category }}
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped lang="scss">
.catalog-filter {
    margin-bottom: 20px;
    min-width: 20%;
}

.catalog-filter__section {
    margin-bottom: 20px;
}

.catalog-filter__title {
    font-size: 26px;
    padding: 24px 0;
    margin-bottom: 10px;
    color: $color-gray;
    width: 100%;
    border-right: 2px solid $color-border;
}

.catalog-filter__list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.catalog-filter__item {
    margin-bottom: 8px;
}

.catalog-filter__label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.catalog-filter__label input {
    margin-right: 8px;
}
</style>