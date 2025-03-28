<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
const authStore = useAuthStore()

import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoritesStore'
import { onMounted } from 'vue'

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

onMounted(() => {
  cartStore.loadCart()
  favoriteStore.loadFavorites()
})
</script>

<template>
  <div class="wrapper">
    <Header />

    <NuxtPage />

    <AuthModal />
    <SearchModal />
    <Preload />
    <Overlay />
    <Footer />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
