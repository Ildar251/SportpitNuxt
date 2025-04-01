export function useYandexMaps() {
    const isYandexMapsLoaded = ref(false)
    const yandexMapsPromise = ref<Promise<void> | null>(null)

    const loadYandexMaps = (apiKey: string) => {
        if (isYandexMapsLoaded.value || yandexMapsPromise.value) {
            return yandexMapsPromise.value
        }

        yandexMapsPromise.value = new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
            script.async = true
            script.onload = () => {
                if (window.ymaps) {
                    window.ymaps.ready(() => {
                        isYandexMapsLoaded.value = true
                        resolve()
                    })
                } else {
                    reject(new Error('Yandex Maps API не удалось загрузить'))
                }
            }
            script.onerror = () => {
                reject(new Error('Ошибка загрузки Yandex Maps API'))
            }
            document.body.appendChild(script)
        })

        return yandexMapsPromise.value
    }

    return { loadYandexMaps, isYandexMapsLoaded }
}