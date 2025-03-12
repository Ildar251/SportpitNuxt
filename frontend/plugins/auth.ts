import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(nuxtApp => {
	// Проверяем, что код выполняется на стороне клиента
	if (import.meta.client) {
		const authStore = useAuthStore()
		authStore.initialize()
	}
})
