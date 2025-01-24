import axios from 'axios'
import { defineStore } from 'pinia'

interface Resource {
    id: number
    pagetitle: string
    introtext: string
    content: string
    parent: number
    parent_title: string | null
    alias: string
    uri: string
}
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

export const useApiStore = defineStore('api', {
    state: () => ({
        resources: [] as Resource[], // Все ресурсы
        products: [] as Products[],  // Только товары
        loading: false,
        error: null as string | null
    }),

    actions: {
        // Загружает все ресурсы (если нужно)
        async fetchResources() {
            this.loading = true
            try {
                const response = await axios.get<Resource[]>(
                    'https://test.top-nnov.ru/api?includeTVs=price,taste,sticker,image,volume'
                )
                this.resources = response.data
            } catch (err) {
                this.error = 'Ошибка загрузки API'
            } finally {
                this.loading = false
            }
        },

        // Загружает только товары (исключает категории)
        async fetchProducts() {
            this.loading = true
            try {
                const response = await axios.get<Resource[]>(
                    'https://test.top-nnov.ru/api?parent=4&includeTVs=price,taste,sticker,image,volume'
                )

                console.log(response.data)
                this.products = response.data // Записываем в products, а не в resources
            } catch (err) {
                this.error = 'Ошибка загрузки товаров'
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getResourceById: (state) => (id: number) => {
            return state.resources.find(resource => resource.id === id) || null
        },

        // Получаем только загруженные товары
        getProducts: (state) => {
            return state.products
        }
    }
})

