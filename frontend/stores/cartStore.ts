import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as any[],
    }),
    actions: {
        loadCart() {
            if (import.meta.client) {
                const cartData = localStorage.getItem('cart')
                this.items = cartData ? JSON.parse(cartData) : []
            }
        },
        saveCart() {
            if (import.meta.client) {
                localStorage.setItem('cart', JSON.stringify(this.items))
            }
        },
        addToCart(product: any) {
            const existing = this.items.find((item) => item.id === product.id)
            if (existing) {
                existing.quantity++
            } else {
                this.items.push({ ...product, quantity: 1 })
            }
            this.saveCart()
        },
        removeFromCart(productId: number) {
            this.items = this.items.filter((item) => item.id !== productId)
            this.saveCart()
        },
        updateQuantity(productId: number, quantity: number) {
            const item = this.items.find((item) => item.id === productId)
            if (item && quantity > 0) {
                item.quantity = quantity
                this.saveCart()
            }
        },
    },
})
