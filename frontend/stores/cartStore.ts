import { useAuthStore } from '@/stores/authStore'
import type { Product } from '@/types/product'
import axios from 'axios'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as Product[],
    }),
    actions: {
        loadCart() {
            if (import.meta.client) {
                const cartData = localStorage.getItem('cart')
                this.items = cartData ? JSON.parse(cartData) as Product[] : []
            }
        },
        saveCart() {
            if (import.meta.client) {
                localStorage.setItem('cart', JSON.stringify(this.items))
            }
        },
        addToCart(product: Product) {
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

        async syncCart() {
            const authStore = useAuthStore()
            if (!authStore.apiToken) return

            try {
                const localCart = [...this.items]

                const serverResponse = await axios.get('https://test.top-nnov.ru/api/cart', {
                    headers: { Authorization: `Bearer ${authStore.apiToken}` },
                })
                console.log('Server cart response:', serverResponse.data)
                const serverCart = serverResponse.data.cart || []

                const mergedCart = this.mergeCarts(serverCart, localCart)

                await axios.post(
                    'https://test.top-nnov.ru/api/cart/sync',
                    { cart: mergedCart },
                    { headers: { Authorization: `Bearer ${authStore.apiToken}` } }
                )

                this.items = mergedCart
                this.saveCart()
            } catch (error) {
                console.error('Ошибка синхронизации корзины', error)
                toast.error('Не удалось синхронизировать корзину', { autoClose: 3000 })
            }
        },

        mergeCarts(serverCart: any, localCart: Product[]): Product[] {
            let serverItems: Product[] = []
            if (Array.isArray(serverCart)) {
                serverItems = serverCart.map(item => ({
                    id: item.id,
                    quantity: item.quantity || 1,
                    title: item.title || '',
                    price: item.price || 0,
                    image: item.image || '',
                    volume: item.volume || 0,
                }))
            } else if (serverCart && typeof serverCart === 'object') {
                serverItems = Object.entries(serverCart).map(([id, quantity]) => ({
                    id: parseInt(id),
                    quantity: parseInt(quantity as string) || 1,
                    title: '',
                    price: 0,
                    image: '',
                    volume: 0,
                }))
            }

            const merged: Product[] = []
            localCart.forEach(localItem => {
                const serverItem = serverItems.find(s => s.id === localItem.id)
                merged.push({
                    ...localItem,
                    quantity: serverItem ? Math.max(serverItem.quantity, localItem.quantity) : localItem.quantity,
                })
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