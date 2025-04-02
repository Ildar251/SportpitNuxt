import { useAuthStore } from '@/stores/authStore'
import type { Product } from '@/types/product'
import axios from 'axios'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as Product[],
    }),

    getters: {
        totalPrice: (state) => {
            return state.items.reduce((total, item) => {
                return total + (item.price || 0) * item.quantity
            }, 0)
        },
    },
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
            const minQty = product.minQuantity || 1
            if (existing) {
                existing.quantity += 1 // После первого добавления увеличиваем по 1
            } else {
                this.items.push({ ...product, quantity: minQty }) // Первое добавление с minQuantity
            }
            this.saveCart()
            toast.success(`Добавлено ${existing ? 1 : minQty} шт. в корзину`, { autoClose: 2000 })
        },
        removeFromCart(productId: number) {
            this.items = this.items.filter((item) => item.id !== productId)
            this.saveCart()
            toast.success('Товар удален из корзины', { autoClose: 2000 })
        },
        updateQuantity(productId: number, quantity: number) {
            const item = this.items.find((item) => item.id === productId)
            if (!item) return

            const minQty = item.minQuantity || 1
            if (quantity >= minQty) {
                item.quantity = quantity // Устанавливаем новое количество (шаг 1 после minQuantity)
                this.saveCart()
            } else {
                this.removeFromCart(productId) // Удаляем, если меньше minQuantity
            }
        },
        isInCart(productId: number) {
            return this.items.some((item) => item.id === productId)
        },
        getQuantity(productId: number) {
            const item = this.items.find((item) => item.id === productId)
            return item ? item.quantity : 0
        },
        async syncCart() {
            const authStore = useAuthStore()
            if (!authStore.apiToken) return

            try {
                const localCart = [...this.items]
                const serverResponse = await axios.get('https://test.top-nnov.ru/api/cart', {
                    headers: { Authorization: `Bearer ${authStore.apiToken}` },
                })
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
                    minQuantity: item.minQuantity || 1,
                }))
            } else if (serverCart && typeof serverCart === 'object') {
                serverItems = Object.entries(serverCart).map(([id, quantity]) => ({
                    id: parseInt(id),
                    quantity: parseInt(quantity as string) || 1,
                    title: '',
                    price: 0,
                    image: '',
                    volume: 0,
                    minQuantity: 1,
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
        clearCart() {
            this.items = []
            this.saveCart()
        },
    },
})