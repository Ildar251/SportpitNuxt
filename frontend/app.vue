<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
const authStore = useAuthStore()

</script>

<template>
  <div class="wrapper">
    <Header />

    <NuxtPage />

    <AuthModal />
    <Preload />
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
