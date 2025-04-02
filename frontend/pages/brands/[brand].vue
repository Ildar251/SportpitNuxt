<script setup lang="ts">
import { useApiStore } from '@/stores/api'
import { useRoute } from 'vue-router'
import { usePage } from '~/composables/usePage'

const route = useRoute()
const apiStore = useApiStore()
const brandAlias = computed(() => route.params.brand as string)
const config = useRuntimeConfig()
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('brands')

// Получаем бренд по alias
const brand = computed(() => {
  return apiStore.brands.find((b) => b.alias === brandAlias.value)
})

// Установка мета-тегов с использованием данных бренда
useHead({
  title: computed(() => {
    if (brand.value) {
      return `${brand.value.title} - ${pageTitle.value || 'Бренды'}` // Например: "Red Bull - Бренды"
    }
    return 'Бренд не найден'
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        if (brand.value) {
          return brand.value.description || pageDescription.value || 'Описание бренда отсутствует'
        }
        return 'Бренд не найден'
      }),
    },
    {
      property: 'og:title',
      content: computed(() => {
        if (brand.value) {
          return `${brand.value.title} - ${pageTitle.value || 'Бренды'}`
        }
        return 'Бренд не найден'
      }),
    },
    {
      property: 'og:description',
      content: computed(() => {
        if (brand.value) {
          return brand.value.description || pageDescription.value || 'Описание бренда отсутствует'
        }
        return 'Бренд не найден'
      }),
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})

// Подсчитываем количество продуктов для текущего бренда
const productsCount = computed(() => {
  if (!brand.value) return 0
  return apiStore.products.filter((product) => product.brand === brand.value?.title).length
})

// Если бренд не найден — выбрасываем 404
watchEffect(() => {
  if (apiStore.brands.length && !brand.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Бренд не найден',
    })
  }
})

// Устанавливаем текущий бренд
watch(
  brand,
  (newBrand) => {
    if (newBrand) {
      apiStore.setCurrentBrand(newBrand.title)
    }
  },
  { immediate: true }
)

// Очищаем фильтр при выходе со страницы
onUnmounted(() => {
  apiStore.setCurrentBrand(null)
  apiStore.setSelectedCategories([])
})

// Загружаем данные, если они ещё не загружены
onMounted(async () => {
  if (!apiStore.brands.length) {
    await apiStore.fetchBrands()
  }
  if (!apiStore.products.length) {
    await apiStore.fetchProducts()
  }
})
</script>

<template>
  <main>
    <section class="section section-hero">
      <div class="container">
        <div v-if="brand" class="hero"
          :style="`background-image: url(${config.public.apiUrl + brand.tvFields.info_bg});`">
          <h1 class="h1">{{ brand.title }}</h1>
          <div class="brand__description">
            <div class="text">
              {{ brand.description }}
            </div>
            <div class="quantity">{{ productsCount }} товаров</div>
          </div>
          <div class="brand__logo">
            <NuxtImg :src="config.public.apiUrl + brand.tvFields.info_logo" :alt="brand.title" />
          </div>
        </div>
      </div>
    </section>

    <component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]"
      :page="page" :noInfoTitle="true" />

    <SectionsSeo />
  </main>
</template>



<style lang="scss" scoped>
.section-hero {
  margin-top: auto-clamp(25px, 50px);
}

.hero {
  padding: auto-clamp(30px, 72px);
  color: $color-white;
  min-height: auto-clamp(300px, 560px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: $color-primary;

  @media screen and (max-width: 768px) {
    margin: -24px;
    height: calc(100svh - 120px);
    display: flex;
    flex-direction: column;
  }

  .h1 {
    font-size: auto-clamp(50px, 140px);
  }

  .brand__description {
    font-size: auto-clamp(14px, 16px);
    @include flex(row, space-between, flex-start);
    margin: auto-clamp(20px, 40px) 0;
    padding: auto-clamp(20px, 40px) 0;
    width: 100%;
    border-top: 2px solid $color-border;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      position: relative;
      margin-top: 100px;

      .quantity {
        position: absolute;
        top: -90px;
      }
    }

    .text {
      max-width: 700px;
      letter-spacing: 0;
      line-height: 1.4;
    }
  }

  .brand__logo {
    filter: brightness(0) invert(1);

    @media screen and (max-width: 768px) {
      margin-top: auto;
    }

  }
}
</style>