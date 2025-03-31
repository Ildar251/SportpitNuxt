import { defineNuxtPlugin } from '#app'
import { useApiStore } from '~/stores/api'

export default defineNuxtPlugin(async (nuxtApp) => {
    const apiStore = useApiStore()

    // Загружаем страницы на сервере (или клиенте, если SSR отключён)
    if (apiStore.pages.length === 0) {
        await apiStore.fetchPages()
    }
})