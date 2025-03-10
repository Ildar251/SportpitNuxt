<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favoritesStore'

const favoriteStore = useFavoriteStore()
</script>

<template>
    <div>
        <div v-if="favoriteStore.items.length === 0">Вы еще не добавили товары в избранное</div>
        <div v-else>
            <div v-for="product in favoriteStore.items" :key="product.id" class="favorite-item">
                <NuxtImg :src="product.image" :alt="product.title" class="favorite-item__image" />
                <div class="favorite-item__info">
                    <h3>{{ product.title }}</h3>
                    <p>{{ product.price }} ₽</p>
                    <button @click="favoriteStore.toggleFavorite(product)">Удалить</button>
                </div>
            </div>
        </div>
    </div>
</template>
