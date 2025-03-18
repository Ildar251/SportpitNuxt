import axios from 'axios'
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

interface User {
	name: string
	surname: string
	phone: string
	email: string
	inn: string
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		apiToken: null as string | null,
		loading: true,
		error: null as string | null,
	}),

	actions: {
		async fetchProfile() {
			try {
				const response = await axios.get<User>(
					'https://test.top-nnov.ru/api/profile',
					{
						withCredentials: true,
						headers: { Authorization: `Bearer ${this.apiToken}` },
					}
				)
				this.user = response.data
				localStorage.setItem('user', JSON.stringify(response.data))
			} catch (err) {
				console.error('Ошибка загрузки профиля', err)
			}
		},

		async login(email: string, password: string) {
			this.loading = true
			this.error = null
			try {
				const response = await axios.post(
					'https://test.top-nnov.ru/api/login',
					new URLSearchParams({ login: email, password }),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
				this.apiToken = response.data.api_token

				// Проверяем, что apiToken не равен null перед сохранением
				if (this.apiToken) {
					localStorage.setItem('apiToken', this.apiToken)
					axios.defaults.headers.common[
						'Authorization'
					] = `Bearer ${this.apiToken}`
				}

				await this.fetchProfile()

				// Синхронизация корзины и избранного
				const cartStore = useCartStore()
				const favoritesStore = useFavoriteStore()
				await cartStore.syncCart()
				await favoritesStore.syncFavorites()

				toast.success('Вы успешно вошли!', { autoClose: 3000 })
			} catch (err) {
				this.error = 'Ошибка входа'
				toast.error('Ошибка входа. Проверьте данные и попробуйте снова', {
					autoClose: 3000,
				})
			} finally {
				this.loading = false
			}
		},

		async register(
			surname: string,
			name: string,
			phone: string,
			email: string,
			password: string,
			inn: string
		) {
			this.loading = true
			this.error = null
			try {
				await axios.post(
					'https://test.top-nnov.ru/api/register',
					new URLSearchParams({ surname, name, phone, email, password, inn }),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
				toast.success(
					'Регистрация успешна! Проверьте почту для подтверждения.',
					{ autoClose: 3000 }
				)
			} catch (err) {
				this.error = 'Ошибка регистрации'
				toast.error('Ошибка регистрации. Попробуйте снова', { autoClose: 3000 })
			} finally {
				this.loading = false
			}
		},

		async confirmEmail(email: string, code: string): Promise<void> {
			this.loading = true
			this.error = null
			try {
				const response = await axios.post<{ api_token: string }>(
					'https://test.top-nnov.ru/api/confirm',
					new URLSearchParams({ email, code }),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
				this.apiToken = response.data.api_token
				localStorage.setItem('apiToken', this.apiToken)
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${this.apiToken}`
				await this.fetchProfile()
				toast.success('Email подтвержден, вход выполнен!', { autoClose: 3000 })
			} catch (err) {
				this.error = 'Ошибка подтверждения'
				toast.error('Ошибка подтверждения. Проверьте код и попробуйте снова', {
					autoClose: 3000,
				})
			} finally {
				this.loading = false
			}
		},

		async logout() {
			this.apiToken = null
			this.user = null
			localStorage.removeItem('apiToken')
			localStorage.removeItem('user')
			delete axios.defaults.headers.common['Authorization']
			console.log(this.apiToken)

			// Загружаем корзину и избранное обратно в localStorage
			const cartStore = useCartStore()
			const favoritesStore = useFavoriteStore()
			cartStore.loadCart()
			favoritesStore.loadFavorites()

			toast.info('Вы вышли из аккаунта', { autoClose: 3000 })
		},

		initialize() {
			this.loading = true
			const apiToken = localStorage.getItem('apiToken')
			const user = localStorage.getItem('user')
			if (apiToken) {
				this.apiToken = apiToken
				axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`
				this.fetchProfile()
			}
			if (user) {
				this.user = JSON.parse(user)
			}
			this.loading = false
		},

		isAuthenticated() {
			return this.apiToken !== null
		}
	},
})
