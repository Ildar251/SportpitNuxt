import axios, { AxiosError } from 'axios' // Импортируем AxiosError
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify'

interface User {
	name: string
	surname: string
	phone: string
	email: string
	inn: string
	isLegalEntity: boolean
	loyaltyPoints: number
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		apiToken: null as string | null,
		loading: true,
		error: undefined as string | undefined, // Меняем тип на string | undefined
	}),

	actions: {
		async fetchProfile() {
			try {
				const response = await axios.get<User>(
					'https://test.top-nnov.ru/api/profile',
					{
						withCredentials: true,
						headers: { authorization: `Bearer ${this.apiToken}` },
					}
				)
				const userData = response.data
				userData.isLegalEntity = !!userData.inn
				userData.loyaltyPoints = userData.loyaltyPoints || 0
				this.user = userData
				localStorage.setItem('user', JSON.stringify(userData))
			} catch (err) {
				console.error('Ошибка загрузки профиля', err)
			}
		},

		async login(email: string, password: string) {
			this.loading = true
			this.error = undefined // Обновляем для нового типа
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

				if (this.apiToken) {
					localStorage.setItem('apiToken', this.apiToken)
					axios.defaults.headers.common[
						'Authorization'
					] = `Bearer ${this.apiToken}`
				}

				await this.fetchProfile()

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
			inn: string,
			isLegalEntity: boolean
		): Promise<{ success: boolean; message: string }> {
			this.loading = true
			this.error = undefined

			try {
				const response = await axios.post(
					'https://test.top-nnov.ru/api/register',
					new URLSearchParams({
						surname,
						name,
						phone,
						email,
						password,
						inn,
						isLegalEntity: isLegalEntity.toString(),
					}),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)

				const message = response.data.message || 'Регистрация успешна!' // ✅ Гарантируем, что это строка

				toast.success(message, { autoClose: 3000 })
				return { success: true, message }
			} catch (err: any) {
				const errorMessage = err.response?.data?.message ?? 'Ошибка регистрации' // ✅ Гарантируем, что это строка
				this.error = errorMessage

				return { success: false, message: errorMessage }
			} finally {
				this.loading = false
			}
		},
		async deleteUser(email: string): Promise<void> {
			this.loading = true
			this.error = undefined
			try {
				await axios.post(
					'https://test.top-nnov.ru/api/delete-user',
					new URLSearchParams({ email }),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
			} catch (err: unknown) {
				if (err instanceof AxiosError) {
					this.error =
						err.response?.data?.message || 'Ошибка удаления пользователя'
				} else {
					this.error = 'Неизвестная ошибка при удалении пользователя'
				}
				throw new Error(this.error)
			} finally {
				this.loading = false
			}
		},

		async confirmEmail(email: string, code: string): Promise<void> {
			this.loading = true
			this.error = undefined
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
			} catch (err: unknown) {
				// Указываем тип unknown
				// Сужаем тип до AxiosError
				if (err instanceof AxiosError) {
					this.error = err.response?.data?.message || 'Ошибка подтверждения'
					throw new Error(this.error)
				}
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
		},

		async addLoyaltyPoints(orderTotal: number) {
			if (!this.user || this.user.isLegalEntity) {
				console.log(
					'Не начисляем бонусы: пользователь не авторизован или является юридическим лицом'
				)
				return
			}

			const pointsToAdd = Math.floor(orderTotal * 0.01)
			console.log(
				`Начисляем ${pointsToAdd} бонусов за заказ на сумму ${orderTotal}`
			)

			this.user.loyaltyPoints += pointsToAdd
			localStorage.setItem('user', JSON.stringify(this.user))
			console.log(
				`Обновили localStorage: loyaltyPoints = ${this.user.loyaltyPoints}`
			)

			try {
				const response = await axios.post(
					'https://test.top-nnov.ru/api/update-loyalty-points',
					{ loyaltyPoints: this.user.loyaltyPoints },
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${this.apiToken}`,
							'Content-Type': 'application/json',
						},
					}
				)
				console.log('Бонусы успешно обновлены на сервере:', response.data)
			} catch (err) {
				console.error('Ошибка обновления бонусов на сервере:', err)
				if (err instanceof AxiosError) {
					console.error('Детали ошибки:', err.response?.data)
					throw new Error(
						err.response?.data?.message || 'Ошибка обновления бонусов'
					)
				}
				throw new Error('Неизвестная ошибка при обновлении бонусов')
			}
		},
	},
})
