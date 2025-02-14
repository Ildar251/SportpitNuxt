<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
</script>

<template>
  <NuxtLayout />
  <AuthModal />
  <Toaster />
</template>
