import { useAuthStore } from '@/stores/authStore'
import type { FavoriteProduct } from '@/types/product'
import axios from 'axios'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        items: [] as FavoriteProduct[],
    }),
    actions: {
        loadFavorites() {
            if (import.meta.client) {
                const favoritesData = localStorage.getItem('favorites')
                this.items = favoritesData ? JSON.parse(favoritesData) as FavoriteProduct[] : []
            }
        },
        saveFavorites() {
            if (import.meta.client) {
                localStorage.setItem('favorites', JSON.stringify(this.items))
            }
        },
        toggleFavorite(product: FavoriteProduct) {
            const existingIndex = this.items.findIndex((item) => item.id === product.id)
            if (existingIndex !== -1) {
                this.items.splice(existingIndex, 1)
            } else {
                this.items.push(product)
            }
            this.saveFavorites()
        },
        isFavorite(productId: number) {
            return this.items.some((item) => item.id === productId)
        },

        async syncFavorites() {
            const authStore = useAuthStore()
            if (!authStore.apiToken) return

            try {
                const localFavorites = [...this.items]

                const serverResponse = await axios.get('https://test.top-nnov.ru/api/favorites', {
                    headers: { Authorization: `Bearer ${authStore.apiToken}` },
                })
                console.log('Server favorites response:', serverResponse.data)
                const serverFavorites = serverResponse.data.favorites || []

                const mergedFavorites = this.mergeFavorites(serverFavorites, localFavorites)

                await axios.post(
                    'https://test.top-nnov.ru/api/favorites/sync',
                    { favorites: mergedFavorites.map(item => item.id) },
                    { headers: { Authorization: `Bearer ${authStore.apiToken}` } }
                )

                this.items = mergedFavorites
                this.saveFavorites()
            } catch (error) {
                console.error('Ошибка синхронизации избранного', error)
                toast.error('Не удалось синхронизировать избранное', { autoClose: 3000 })
            }
        },

        mergeFavorites(serverFavorites: any, localFavorites: FavoriteProduct[]): FavoriteProduct[] {
            let serverItems: FavoriteProduct[] = []
            if (Array.isArray(serverFavorites)) {
                serverItems = serverFavorites.map(id => ({
                    id: parseInt(id as string),
                    title: '',
                    price: 0,
                    image: '',
                    volume: 0,
                }))
            }

            const merged: FavoriteProduct[] = []
            localFavorites.forEach(localItem => {
                if (!merged.find(m => m.id === localItem.id)) {
                    merged.push({ ...localItem })
                }
            })

            serverItems.forEach(serverItem => {
                if (!merged.find(m => m.id === serverItem.id)) {
                    merged.push(serverItem)
                }
            })

            return merged
        },
    },
})