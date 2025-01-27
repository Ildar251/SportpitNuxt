import axios from 'axios'
import { defineStore } from 'pinia'

interface Products {
    id: number
    pagetitle: string
    introtext: string
    content: string
    parent: number
    parent_title: string | null
    alias: string
    uri: string
    price?: string
    taste?: string
    sticker?: string
    image?: string
    volume?: string
}

interface Page {
    id: number
    title: string
    alias: string
    sections: string
}

export const useApiStore = defineStore('api', {
    state: () => ({
        products: [] as Products[],
        pages: [] as Page[],
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchProducts() {
            this.loading = true
            try {
                const response = await axios.get<Products[]>(
                    'https://test.top-nnov.ru/api/products'
                )
                this.products = response.data
            } catch (err) {
                this.error = 'Ошибка загрузки товаров'
            } finally {
                this.loading = false
            }
        },

        async fetchPages() {
            this.loading = true
            try {
                const response = await axios.get<Page[]>(
                    'https://test.top-nnov.ru/api/pages'
                )
                this.pages = response.data // Записываем страницы в store
            } catch (err) {
                this.error = 'Ошибка загрузки страниц'
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getProducts: (state) => {
            return state.products
        },

        getPages: (state) => {
            return state.pages
        }
    }
})

