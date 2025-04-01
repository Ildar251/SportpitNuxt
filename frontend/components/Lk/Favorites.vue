<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favoritesStore'
const favoriteStore = useFavoriteStore()
</script>

<template>
    <div>
        <div v-if="favoriteStore.items.length === 0">Вы еще не добавили товары в избранное</div>
        <div v-else class="card-list" v-auto-animate>
            <Card v-for="product in favoriteStore.items" :key="product.id" :product="{
                id: product.id,
                title: product.title || 'Без названия',
                price: product.price !== undefined ? String(product.price) : undefined,
                image: product.image || '',
                volume: product.volume !== undefined ? String(product.volume) : '',
                description: '',
                content: '',
                parent: 0,
                category: null,
                alias: product.alias || '',
            }" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 42px;
}
</style>