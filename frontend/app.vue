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

    <div class="mobile-bar">
      <div class="mobile-bar__item">
        <NuxtLink to="/">
          <NuxtIcon name="home" />
        </NuxtLink>
      </div>
      <div class="mobile-bar__item">
        <NuxtLink to="/lk">
          <NuxtIcon name="lk" />
        </NuxtLink>
      </div>
      <div class="mobile-bar__item">
        <NuxtLink to="tel:">
          <NuxtIcon name="phone_mobile" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mobile-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2E334699;
  z-index: 100;
  max-width: 380px;
  padding: 4px;
  gap: 4px;
  display: none;

  @media screen and (max-width: 768px) {
    @include flex(row, space-around, center);
  }

  &__item {
    @include flex(row, center, center);
    font-size: 24px;
    color: $color-white;
    background-color: #FFF4F41A;
    width: 90px;
    height: 44px;
  }
}

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
