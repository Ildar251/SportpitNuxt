import type { ProductFull } from '@/types/product'
import axios from 'axios'
import { defineStore } from 'pinia'

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
	description: string
	tvFields: Record<string, any>
}

interface Stocks {
	id: number
	title: string
	alias: string
	description: string
	tvFields: Record<string, any>
}

export const useApiStore = defineStore('api', {
	state: () => ({
		products: [] as ProductFull[],
		pages: [] as Page[],
		sections: [] as Section[],
		categories: [] as Categories[],
		brands: [] as Brands[],
		stocks: [] as Stocks[],
		loading: false,
		error: null as string | null,
		selectedBrands: [] as string[], // Выбранные бренды
		selectedCategories: [] as string[], // Выбранные категории
		currentBrand: null as string | null, // Текущий бренд (для страницы бренда)
	}),

	actions: {
		async fetchProducts() {
			this.loading = true
			try {
				const response = await axios.get<ProductFull[]>(
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
				this.pages = response.data
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

		async fetchStocks() {
			this.loading = true
			try {
				const response = await axios.get<Stocks[]>(
					'https://test.top-nnov.ru/api/stocks'
				)
				this.stocks = response.data
			} catch (err) {
				this.error = 'Ошибка загрузки секций'
			} finally {
				this.loading = false
			}
		},

		// Установка текущего бренда (для страницы бренда)
		setCurrentBrand(brand: string | null) {
			this.currentBrand = brand
		},

		// Установка выбранных брендов
		setSelectedBrands(brands: string[]) {
			this.selectedBrands = brands
		},

		// Установка выбранных категорий
		setSelectedCategories(categories: string[]) {
			this.selectedCategories = categories
		},
	},

	getters: {
		getProducts: state => {
			return state.products
		},

		getPages: state => {
			return state.pages
		},

		// Получение уникальных брендов
		uniqueBrands: state => {
			const brands = new Set<string>()
			state.products.forEach(product => {
				if (product.brand) {
					brands.add(product.brand)
				}
			})
			return Array.from(brands)
		},

		// Получение уникальных категорий
		uniqueCategories: state => {
			const categories = new Set<string>()
			state.products.forEach(product => {
				if (product.category) {
					categories.add(product.category)
				}
			})
			return Array.from(categories)
		},

		// Получение отфильтрованных продуктов
		filteredProducts: state => {
			return state.products.filter(product => {
				// Если задан currentBrand (на странице бренда), фильтруем только по этому бренду
				const matchesBrand =
					(state.currentBrand
						? product.brand === state.currentBrand
						: state.selectedBrands.length === 0 ||
						state.selectedBrands.includes(product.brand || ''))
				const matchesCategory =
					state.selectedCategories.length === 0 ||
					state.selectedCategories.includes(product.category || '')
				return matchesBrand && matchesCategory
			})
		},

		getStockByAlias: state => (alias: string) => {
			return state.stocks.find(stock => stock.alias === alias)
		},
	},
})