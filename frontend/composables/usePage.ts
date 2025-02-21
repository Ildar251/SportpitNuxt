import { useApiStore } from '~/stores/api'

export function usePage(alias: string) {
    const apiStore = useApiStore()
    const sectionsData = ref<Record<string, any>>({})
    const sections = ref<string[]>([])

    onMounted(async () => {
        console.log(`🔵 usePage: Загрузка данных для ${alias}`)

        if (apiStore.pages.length === 0) {
            console.log('📥 Загружаем страницы...')
            await apiStore.fetchPages()
        }
        if (apiStore.sections.length === 0) {
            console.log('📥 Загружаем секции...')
            await apiStore.fetchSections()
        }

        const page = apiStore.pages.find((p) => p.alias === alias)
        if (!page) {
            console.warn(`❌ Страница ${alias} не найдена!`)
            return
        }

        console.log('✅ Найдена страница:', page)

        const sectionNames = page.sections ? page.sections.split('||') : []

        // Преобразуем "SectionsHero" → "Hero" и "SectionsCatalog" → "Catalog"
        const formattedSections = sectionNames.map((section) =>
            section.replace(/^Section/, '')
        )

        // 🔥 Теперь мы приводим API title к тому же формату, что и в sections
        sectionsData.value = apiStore.sections
            .filter((section) => formattedSections.includes(section.title.replace(/^Section/, '')))
            .reduce((acc, section) => {
                const key = section.title.replace(/^Section/, '') // "SectionHero" → "Hero"
                acc[key] = section.tvFields
                return acc
            }, {} as Record<string, any>)

        sections.value = formattedSections

        console.log('📌 Итоговый список секций:', sections.value)
        console.log('📌 TV-поля секций:', sectionsData.value)
    })

    const sectionMap = computed(() => {
        return sections.value.reduce((acc, section) => {
            acc[section] = defineAsyncComponent(() => import(`@/components/Sections/${section}.vue`))
            return acc
        }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>)
    })


    return { sections, sectionMap, sectionsData, page: computed(() => apiStore.pages.find((p) => p.alias === alias)) }
}
