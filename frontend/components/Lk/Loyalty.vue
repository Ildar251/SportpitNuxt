<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Проверяем, что пользователь — физическое лицо
const isEligibleForLoyalty = computed(() => {
    return authStore.user && !authStore.user.isLegalEntity
})
</script>

<template>
    <div v-if="isEligibleForLoyalty" class="loyalty-program">
        <p>Добро пожаловать в программу лояльности!</p>
        <p>За каждую покупку вы получаете 1% от суммы заказа в виде бонусов.</p>
        <p>Ваш текущий баланс: <strong>{{ authStore.user?.loyaltyPoints || 0 }}</strong> бонусов</p>
    </div>
    <div v-else class="loyalty-program">
        <p>Программа лояльности доступна только для физических лиц.</p>
    </div>
</template>

<style scoped lang="scss">
.loyalty-program {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;

    p {
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
    }

    strong {
        color: #2ecc71;
    }
}
</style>