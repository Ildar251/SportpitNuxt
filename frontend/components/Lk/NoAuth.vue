<script setup lang="ts">
const modalStore = useModalStore()
</script>

<template>
    <div class="lk__noAuth">
        <div class="lk__noAuth-text">
            <NuxtIcon name="warning" />
            <h4 class="h4">Для доступа к личному кабинету авторизуйтесь</h4>
        </div>

        <div class="fill btn" @click.prevent="modalStore.open">
            <NuxtIcon name="user" />
            <span>Авторизоваться</span>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.lk__noAuth {
    @include flex(row, space-between, center);
    gap: 32px;
    background-color: #FCFCFC;
    padding: auto-clamp(16px, 42px);

    .lk__noAuth-text {
        @include flex(row, flex-start, center);
        gap: 12px;

        .nuxt-icon {
            font-size: 24px;
        }

        .h4 {
            font-size: auto-clamp(14px, 20px);
        }
    }

    .btn {
        margin-top: 0;
        max-width: 360px;
        width: 100%;
    }
}
</style>