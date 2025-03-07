<script setup lang="ts">
const modalStore = useModalStore()
</script>

<template>
    <div class="lk__noAuth">
        <div class="lk__noAuth-text">
            <NuxtIcon name="warning" />
            <h4 class="h4">Для доступа к личному кабинету авторизуйтесь</h4>
        </div>

        <div class="btn-auth btn" @click.prevent="modalStore.open">
            <NuxtIcon name="user" />
            <span>Авторизоваться</span>
        </div>
    </div>
</template>