<!-- components/SearchModal.vue -->
<script setup lang="ts">
import { useApiStore } from '@/stores/api'
import { useSearchModalStore } from '@/stores/useSearchModalStore'
const config = useRuntimeConfig()
const searchModalStore = useSearchModalStore()
const apiStore = useApiStore()

// Состояние для поискового запроса
const searchQuery = ref('')

// Фильтрованные товары на основе поискового запроса
const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return []
    }
    return apiStore.products.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

// Закрытие модального окна
const closeModal = () => {
    searchModalStore.close()
    searchQuery.value = ''
}
</script>

<template>
    <Transition name="modal">
        <div v-if="searchModalStore.isOpen" class="search-modal">
            <div class="search-modal__content">
                <div class="search-modal__header">
                    <h2 class="search-modal__title">Поиск товаров</h2>
                    <button class="search-modal__close" @click="closeModal">
                        <NuxtIcon name="close" />
                    </button>
                </div>
                <div class="search-modal__body">
                    <input v-model="searchQuery" type="text" placeholder="Введите название товара..."
                        class="search-modal__input" autofocus />
                    <div v-if="filteredProducts.length" class="search-modal__results">
                        <NuxtLink v-for="product in filteredProducts" :key="product.id"
                            :to="`/products/${product.alias}`" class="search-modal__result" @click="closeModal">
                            <div class="search-modal__result-image">
                                <NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" loading="lazy"
                                    width="50" height="50" />
                            </div>
                            <div class="search-modal__result-info">
                                <h3 class="search-modal__result-title">{{ product.title }}</h3>
                                <p class="search-modal__result-price">
                                    {{ product.price ? `${product.price} ₽` : 'Цена не указана' }}
                                </p>
                            </div>
                        </NuxtLink>
                    </div>
                    <div v-else-if="searchQuery.trim()" class="search-modal__no-results">
                        Ничего не найдено
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.search-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 120;
    /* Выше оверлея */
}

.search-modal__content {
    background: white;
    border-radius: 0px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    padding: 24px;
}

.search-modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.search-modal__title {
    font-size: 24px;
    font-weight: 600;
}

.search-modal__close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
}

.search-modal__input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    margin-bottom: 16px;
}

.search-modal__results {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.search-modal__result {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 4px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f5f5f5;
    }
}

.search-modal__result-image {
    flex-shrink: 0;
}

.search-modal__result-image img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.search-modal__result-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.search-modal__result-price {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.search-modal__no-results {
    text-align: center;
    color: #666;
    font-size: 16px;
}
</style>