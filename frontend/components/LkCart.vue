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
                    <NuxtImg v-if="product.image" :src="config.public.apiUrl + product.image"
                        :alt="product.title || 'Товар'" />
                    <NuxtImg v-else src="/placeholder.png" alt="Нет изображения" />
                </div>

                <div class="cart-item__info">
                    <div class="left">
                        <h3 class="h3">{{ product.title || 'Без названия' }}</h3>
                        <p class="cart-item__volume">{{ product.volume ? `${product.volume} мл` : 'Не указано' }}</p>
                        <div class="cart-item__quantity">
                            <span>Количество:</span>
                            <div class="quantity-count">
                                <NuxtIcon name="minus"
                                    @click="cartStore.updateQuantity(product.id, product.quantity - 1)" />
                                {{ product.quantity }}
                                <NuxtIcon name="plus-calc"
                                    @click="cartStore.updateQuantity(product.id, product.quantity + 1)" />
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <button @click="cartStore.removeFromCart(product.id)">
                            <NuxtIcon name="delete" />
                        </button>
                        <div class="cart-item__price">{{ product.price ? `${product.price} ₽` : 'Цена не указана' }}
                        </div>
                    </div>
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
    @include flex(row, flex-start, stretch);
    width: 100%;
    gap: auto-clamp(12px, 72px);
    background-color: #FCFCFC;
    padding: 24px;

    .cart-item__image {
        @include flex(row, center, center);
        background-color: $color-light;
        width: 196px;
        height: 196px;

        img {
            height: 80%;
        }
    }

    .cart-item__price {
        font-weight: 700;
        font-size: auto-clamp(24px, 42px);
        color: $color-primary;
    }

    .cart-item__volume {
        font-size: auto-clamp(16px, 24px);
        color: $color-gray;
        margin-top: 12px;
    }

    .cart-item__quantity {
        color: $color-gray;
        margin-top: auto;

        .quantity-count {
            @include flex(row, flex-start, center);
            gap: 24px;
            color: $color-primary;
            font-weight: 700;
            font-size: auto-clamp(16px, 26px);
            margin-top: 14px
        }
    }

    .cart-item__info {
        @include flex(row, space-between, stretch);
        flex: 1;
        height: auto;
        padding-bottom: 24px;


        .left {
            @include flex(column, flex-start, flex-start);
            height: auto
        }

        .right {
            @include flex(column, space-between, flex-end);

        }

        .h3 {
            font-size: 24px;
        }
    }
}
</style>
