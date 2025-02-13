import axios from 'axios'
import { defineStore } from 'pinia'

interface User {
	fullName: string
	phone: string
	email: string
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		apiToken: null as string | null,
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async login(email: string, password: string) {
			this.loading = true
			this.error = null
			try {
				const response = await axios.post(
					'https://test.top-nnov.ru/api/login',
					new URLSearchParams({ login: email, password }), // ✅ исправил email → login
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
				this.apiToken = response.data.api_token
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${this.apiToken}`
			} catch (err) {
				this.error = 'Ошибка входа'
			} finally {
				this.loading = false
			}
		},

		async register(phone: string, email: string, password: string) {
			this.loading = true
			this.error = null
			try {
				await axios.post(
					'https://test.top-nnov.ru/api/register',
					new URLSearchParams({ email, phone, password }), // ✅ убрал лишние поля
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
			} catch (err) {
				this.error = 'Ошибка регистрации'
			} finally {
				this.loading = false
			}
		},

		async confirmEmail(code: string, value?: string): Promise<void> {
			this.loading = true
			this.error = null
			try {
				const response = await axios.post<{ api_token: string }>(
					'https://test.top-nnov.ru/api/confirm',
					new URLSearchParams({ code }),
					{
						withCredentials: true,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					}
				)
				this.apiToken = response.data.api_token
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${this.apiToken}`
			} catch (err) {
				this.error = 'Ошибка подтверждения'
			} finally {
				this.loading = false
			}
		},

		async logout(): Promise<void> {
			this.apiToken = null
			this.user = null
			delete axios.defaults.headers.common['Authorization']
		},
	},
})
