import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        items: [] as any[],
    }),
    actions: {
        loadFavorites() {
            if (import.meta.client) {
                const favoritesData = localStorage.getItem('favorites')
                this.items = favoritesData ? JSON.parse(favoritesData) : []
            }
        },
        saveFavorites() {
            if (import.meta.client) {
                localStorage.setItem('favorites', JSON.stringify(this.items))
            }
        },
        toggleFavorite(product: any) {
            const existingIndex = this.items.findIndex((item) => item.id === product.id)
            if (existingIndex !== -1) {
                this.items.splice(existingIndex, 1) // Удаляем из избранного
            } else {
                this.items.push(product) // Добавляем в избранное
            }
            this.saveFavorites()
        },
        isFavorite(productId: number) {
            return this.items.some((item) => item.id === productId)
        },
    },
})
