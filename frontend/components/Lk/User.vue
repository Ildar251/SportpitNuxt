<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
    <div class="personal__info">
        <div class="personal__info-item">
            {{ authStore.user?.name }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.surname }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.phone }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.email }}
        </div>
        <div class="personal__info-item">
            {{ authStore.user?.inn }}
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