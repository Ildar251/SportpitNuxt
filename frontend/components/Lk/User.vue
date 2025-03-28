<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

// Интерфейсы для ответа DaData
interface DaDataSuggestion {
    value: string
    data: {
        inn: string
        kpp: string
        ogrn: string
        name: {
            full_with_opf: string
            short_with_opf: string
        }
    }
}

interface DaDataResponse {
    suggestions: DaDataSuggestion[]
}

const authStore = useAuthStore()
const config = useRuntimeConfig()

// Состояние для названия компании
const company = ref<string | null>(null)
const isLoadingCompany = ref(false)
const companyError = ref<string | null>(null)

// API-ключ DaData из переменных окружения
const dadataToken = config.public.dadataApiKey || 'a62e56a6bd46f35c62df5d8580a9747edef5fda4'

// Функция для получения названия компании по ИНН
const fetchCompanyByInn = async (inn: string) => {
    if (!inn) return

    isLoadingCompany.value = true
    companyError.value = null

    try {
        const response = await $fetch<DaDataResponse>('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${dadataToken}`,
            },
            body: JSON.stringify({ query: inn }),
        })

        if (response.suggestions && response.suggestions.length > 0) {
            company.value = response.suggestions[0].value
        } else {
            companyError.value = 'Компания не найдена'
        }
    } catch (error) {
        console.error('Ошибка при запросе к DaData:', error)
        companyError.value = 'Ошибка при загрузке данных компании'
    } finally {
        isLoadingCompany.value = false
    }
}

// Вызываем запрос, если у пользователя есть ИНН
watch(
    () => authStore.user?.inn,
    (newInn) => {
        if (newInn) {
            fetchCompanyByInn(newInn)
        } else {
            company.value = null
            companyError.value = null
        }
    },
    { immediate: true }
)
</script>

<template>
    <div class="personal__info">
        <div class="personal__info-item">
            {{ authStore.user?.name || 'Имя не указано' }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.surname || 'Фамилия не указана' }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.phone || 'Телефон не указан' }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.email || 'Email не указан' }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.inn || 'ИНН не указан' }}
        </div>
        <div class="personal__info-item" v-if="authStore.user?.inn">
            <span v-if="isLoadingCompany">Загрузка...</span>
            <span v-else-if="companyError">{{ companyError }}</span>
            <span v-else-if="company">{{ company }}</span>
            <span v-else>Компания не найдена</span>
        </div>
    </div>
    <div class="btn logout" @click="authStore.logout">
        <NuxtIcon name="logout" />
        <span>Выйти из аккаунта</span>
    </div>
</template>


<style lang="scss" scoped>
.personal__info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: auto-clamp(20px, 40px);

    &-item {
        padding: auto-clamp(18px, 26px) auto-clamp(28px, 42px);
        background-color: #fcfcfc;
        font-size: auto-clamp(16px, 24px);
        flex: 1;
    }
}

.logout {
    @include flex(row, flex-start, center);
    gap: 12px;
    margin-top: 42px;
    font-size: auto-clamp(16px, 20px);
    color: $color-gray;
    cursor: pointer;

    &:hover {
        color: $color-accent;
    }
}
</style>