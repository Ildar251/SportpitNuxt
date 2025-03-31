import { useApiStore } from '~/stores/api'

export function usePage(alias: string) {
    const apiStore = useApiStore()
    const sectionsData = ref<Record<string, any>>({})
    const sections = ref<string[]>([])

    onMounted(async () => {

        if (apiStore.pages.length === 0) {
            await apiStore.fetchPages()
        }
        if (apiStore.sections.length === 0) {
            await apiStore.fetchSections()
        }

        const page = apiStore.pages.find((p) => p.alias === alias)
        if (!page) {
            return
        }
        const sectionNames = page.sections ? page.sections.split('||') : []

        // Преобразуем "SectionsHero" → "Hero" и "SectionsCatalog" → "Catalog"
        const formattedSections = sectionNames.map((section) =>
            section.replace(/^Section/, '')
        )

        sectionsData.value = apiStore.sections
            .filter((section) => formattedSections.includes(section.title.replace(/^Section/, '')))
            .reduce((acc, section) => {
                const key = section.title.replace(/^Section/, '') // "SectionHero" → "Hero"
                acc[key] = section.tvFields
                return acc
            }, {} as Record<string, any>)

        sections.value = formattedSections
    })

    const sectionMap = computed(() => {
        return sections.value.reduce((acc, section) => {
            acc[section] = defineAsyncComponent(() => import(`@/components/Sections/${section}.vue`))
            return acc
        }, {} as Record<string, ReturnType<typeof defineAsyncComponent>>)
    })

    const page = computed(() => apiStore.pages.find((p) => p.alias === alias))

    // Добавляем title и description для удобства
    const pageTitle = computed(() => page.value?.title || 'Без названия')
    const pageDescription = computed(() => page.value?.description || '')

    return { sections, sectionMap, sectionsData, page, pageTitle, pageDescription }
}