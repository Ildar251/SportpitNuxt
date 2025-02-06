import axios from 'axios'
import { defineStore } from 'pinia'

interface Products {
	id: number
	title: string
	description: string
	content: string
	parent: number
	category: string | null
	alias: string
	uri: string
	price?: string
	taste?: string
	sticker?: string
	image?: string
	volume?: string
	brand?: string
}

interface Page {
	id: number
	title: string
	alias: string
	sections: string
}

interface Section {
	id: number
	title: string
	tvFields: Record<string, any>
}

interface Categories {
	id: number
	title: string
	alias: string
	tvFields: Record<string, any>
}

interface Brands {
	id: number
	title: string
	alias: string
	tvFields: Record<string, any>
}

export const useApiStore = defineStore('api', {
	state: () => ({
		products: [] as Products[],
		pages: [] as Page[],
		sections: [] as Section[],
		categories: [] as Categories[],
		brands: [] as Brands[],
		loading: false,
		error: null as string | null,
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
		},

		async fetchSections() {
			this.loading = true
			try {
				const response = await axios.get<Section[]>(
					'https://test.top-nnov.ru/api/sections'
				)
				this.sections = response.data
			} catch (err) {
				this.error = 'Ошибка загрузки секций'
			} finally {
				this.loading = false
			}
		},

		async fetchCategories() {
			this.loading = true
			try {
				const response = await axios.get<Categories[]>(
					'https://test.top-nnov.ru/api/categories'
				)
				this.categories = response.data
			} catch (err) {
				this.error = 'Ошибка загрузки секций'
			} finally {
				this.loading = false
			}
		},

		async fetchBrands() {
			this.loading = true
			try {
				const response = await axios.get<Brands[]>(
					'https://test.top-nnov.ru/api/brands'
				)
				this.brands = response.data
			} catch (err) {
				this.error = 'Ошибка загрузки секций'
			} finally {
				this.loading = false
			}
		},
	},

	getters: {
		getProducts: state => {
			return state.products
		},

		getPages: state => {
			return state.pages
		},
	},
})
