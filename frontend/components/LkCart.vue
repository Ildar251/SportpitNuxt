<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
const config = useRuntimeConfig()
const cartStore = useCartStore()
</script>

<template>
    <div>
        <div v-if="cartStore.items.length === 0">Корзина пуста</div>
        <div class="cart-list" v-else>
            <div v-for="product in cartStore.items" :key="product.id" class="cart-item">
                <div class="cart-item__image">
                    <NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" class="" />
                </div>

                <div class="cart-item__info">
                    <h3 class="h3">{{ product.title }}</h3>
                    <p>{{ product.volume }}</p>
                    <p>{{ product.price }} ₽</p>
                    <button @click="cartStore.removeFromCart(product.id)">Удалить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cart-list {
    @include flex(column, flex-start, flex-start);
    gap: 12px;
}

.cart-item {
    @include flex(row, flex-start, flex-start);
    width: 100%;
    gap: 72px;
    background-color: #FCFCFC;
    padding: 24px;

    .cart-item__image {
        @include flex(row, center, center);
        background-color: $color-light;
        width: 196px;
        height: 196px;
    }

    .cart-item__info {
        .h3 {
            font-size: 24px;
        }
    }
}
</style>
