import { useApiStore } from '@/stores/api'

export function useSiteSettings() {
    const apiStore = useApiStore()

    // Загружаем страницы, если они ещё не загружены
    onMounted(async () => {
        if (apiStore.pages.length === 0) {
            await apiStore.fetchPages()
        }
    })

    // Возвращаем настройки
    return computed(() => apiStore.getSiteSettings)
}