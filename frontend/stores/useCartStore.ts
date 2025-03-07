import { defineStore } from 'pinia'

interface CartItem {
    id: number
    title: string
    price?: string
    image?: string
    volume?: string
    quantity: number
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[],
        favorites: JSON.parse(localStorage.getItem('favorites') || '[]') as CartItem[],
    }),

    actions: {
        addToCart(product: CartItem) {
            const existing = this.cart.find(item => item.id === product.id)
            if (existing) {
                existing.quantity++
            } else {
                this.cart.push({ ...product, quantity: 1 })
            }
            this.saveCart()
        },

        removeFromCart(productId: number) {
            this.cart = this.cart.filter(item => item.id !== productId)
            this.saveCart()
        },

        toggleFavorite(product: CartItem) {
            const index = this.favorites.findIndex(item => item.id === product.id)
            if (index !== -1) {
                this.favorites.splice(index, 1)
            } else {
                this.favorites.push(product)
            }
            this.saveFavorites()
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart))
        },

        saveFavorites() {
            localStorage.setItem('favorites', JSON.stringify(this.favorites))
        },

        clearCart() {
            this.cart = []
            this.saveCart()
        },

        async syncCartWithServer(apiToken: string) {
            if (!apiToken) return

            await fetch('https://test.top-nnov.ru/api/sync-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiToken}`,
                },
                body: JSON.stringify({ cart: this.cart }),
            })

            this.clearCart() // Очищаем локальную корзину после синхронизации
        },
    },
})
