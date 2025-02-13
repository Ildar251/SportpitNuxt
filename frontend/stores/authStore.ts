// stores/auth.ts
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import { useModalStore } from './modal'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null as { username: string; email: string } | null,
    }),
    actions: {
        async login(emailOrUsername: string, password: string) {
            try {
                const response = await fetch('https://test.top-nnov.ru/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailOrUsername, password }),
                    credentials: 'include',
                })
                const data = await response.json()

                if (!response.ok) throw new Error(data.message || 'Ошибка входа')

                this.isAuthenticated = true
                this.user = { username: data.username, email: data.email }

                toast.success('Вы успешно вошли!')
                useModalStore().closeAuthModal()
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
                toast.error(errorMessage)
            }
        },

        async register(username: string, email: string, password: string) {
            try {
                const response = await fetch('https://test.top-nnov.ru/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                })
                const data = await response.json()

                if (!response.ok) throw new Error(data.message || 'Ошибка регистрации')

                toast.success('Регистрация успешна! Теперь вы можете войти.')
                useModalStore().openAuthModal()
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
                toast.error(errorMessage)
            }
        },

        async logout() {
            try {
                await fetch('https://test.top-nnov.ru/api/logout', {
                    method: 'POST',
                    credentials: 'include',
                })

                this.isAuthenticated = false
                this.user = null

                toast.info('Вы вышли из системы')
            } catch {
                toast.error('Ошибка при выходе')
            }
        },
    },
})
