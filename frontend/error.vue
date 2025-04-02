<script setup lang="ts">
// Извлекаем пропс error
const { error } = defineProps<{ error: { statusCode: number; message: string; stack?: string } }>()

// Используем Nuxt-компосабль для навигации
const router = useRouter()

// Функция для очистки ошибки и перехода
const clearErrorAndNavigate = (to: string) => {
    // Очищаем ошибку и перенаправляем
    clearError({ redirect: to })
}

// Вычисляемые свойства для отображения
const statusCode = computed(() => error?.statusCode || 404)
const errorMessage = computed(() => error?.message || 'Страница не найдена')
const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchBrands()
})

const brands = computed(() => apiStore.brands)
</script>

<template>
    <div class="wrapper">
        <Header />
        <main>
            <section>
                <div class="container">
                    <h1 class="h1 page-title">Ошибка {{ statusCode }}</h1>
                    <p class="error-message">{{ errorMessage }}</p>
                </div>
                <div class="container ">
                    <div class="error-row">
                        <div class="error-container">
                            <h2 class="h2">Увы, такой страницы не существует</h2>
                            <div class="btns">
                                <NuxtLink to="/catalog" class="link"><span>Каталог</span>
                                </NuxtLink>
                                <NuxtLink to="/" class="link">
                                    <span>Перейти на главную</span>
                                </NuxtLink>
                            </div>
                        </div>

                        <div class="menu__brands">
                            <div class="menu__brands-title">
                                Бренды
                            </div>
                            <div v-for="brand in brands" :key="brand.id">
                                <NuxtLink :to="`/brands/${brand.alias}`" class="link">
                                    {{ brand.title }}
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <SectionsCapture />
        </main>
        <AuthModal />
        <SearchModal />
        <Overlay />
        <Footer />
    </div>
</template>

<style scoped lang="scss">
.error-row {
    @include flex(row, space-between, flex-start);
    border-top: 2px solid $color-border;
    margin-top: auto-clamp(50px, 100px);
    padding-top: auto-clamp(40px, 72px);
    margin-bottom: auto-clamp(50px, 100px);
    background-image: url(/images/error-bg.png);
    background-position: center;
    background-size: 50%;
    background-repeat: no-repeat;
    height: calc(100svh - 100px);

    @media screen and (max-width: 768px) {
        flex-direction: column;
        ;
    }
}

.menu__brands {
    &-title {
        font-size: auto-clamp(28px, 44px);
        margin-bottom: auto-clamp(20px, 24px);
        color: $color-accent;
        font-weight: bold;
    }

    .link {
        font-size: auto-clamp(24px, 32px);
        color: $color-primary;
        margin-bottom: 12px;
        display: inline-block;
        font-weight: bold;
    }
}

.error-container {


    .h2 {
        font-size: auto-clamp(24px, 50px);
    }

    .link {
        font-size: auto-clamp(16px, 24px);
    }


    .btns {
        display: flex;
        gap: 26px;
        margin-top: 42px;
        align-items: center;

        .btn {
            margin-top: 0;
        }
    }
}
</style>