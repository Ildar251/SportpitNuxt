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
                price: product.price !== undefined ? String(product.price) : undefined, // Приводим число к строке
                image: product.image || '',
                volume: product.volume !== undefined ? String(product.volume) : '', // Уже строка
                description: '',
                content: '',
                parent: 0,
                category: null,
                alias: `${product.id}`,
            }" />
        </div>
    </div>
</template>