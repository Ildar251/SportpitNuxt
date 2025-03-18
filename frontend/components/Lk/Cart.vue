<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import gsap from 'gsap'

const config = useRuntimeConfig()
const cartStore = useCartStore()

const animatedQuantity = ref<Record<number, number>>({})
const animatedTotalPrice = ref(0)

// Инициализация анимированных значений
onMounted(() => {
	cartStore.items.forEach(product => {
		animatedQuantity.value[product.id] = product.quantity
	})
	animatedTotalPrice.value = cartStore.totalPrice
})

// Наблюдение за изменениями в количестве товаров
watch(
	() => cartStore.items.map(p => ({ id: p.id, quantity: p.quantity })),
	newValues => {
		newValues.forEach(({ id, quantity }) => {
			gsap.to(animatedQuantity.value, {
				[id]: quantity,
				duration: 0.7,
				ease: 'power2.out',
			})
		})
	},
	{ deep: true }
)

// Наблюдение за изменением общей суммы
watch(
	() => cartStore.totalPrice,
	newPrice => {
		gsap.to(animatedTotalPrice, {
			value: newPrice,
			duration: 0.9,
			ease: 'power2.out',
		})
	}
)
</script>

<template>
	<div>
		<div v-if="cartStore.items.length === 0">Корзина пуста</div>
		<div v-else>
			<div class="cart-list" v-auto-animate>
				<div
					v-for="product in cartStore.items"
					:key="product.id"
					class="cart-item"
				>
					<div class="cart-item__image">
						<NuxtImg
							placeholder="./images/box.svg"
							:src="config.public.apiUrl + product.image"
							:alt="product.title || 'Товар'"
						/>
					</div>

					<div class="cart-item__info">
						<div class="left">
							<h3 class="h3">{{ product.title || 'Без названия' }}</h3>
							<p class="cart-item__volume">
								{{ product.volume ? `${product.volume} мл` : 'Не указано' }}
							</p>
							<div class="cart-item__quantity">
								<span>Количество:</span>
								<div class="quantity-count">
									<NuxtIcon
										name="minus"
										@click="
											cartStore.updateQuantity(product.id, product.quantity - 1)
										"
									/>
									{{ Math.round(animatedQuantity[product.id] || 0) }}
									<NuxtIcon
										name="plus-calc"
										@click="
											cartStore.updateQuantity(product.id, product.quantity + 1)
										"
									/>
								</div>
							</div>
						</div>

						<div class="right">
							<button @click="cartStore.removeFromCart(product.id)">
								<NuxtIcon name="delete" />
							</button>
							<div class="cart-item__price">
								{{
									product.price
										? `${Math.round(
												animatedQuantity[product.id] * product.price
										  )}`
										: `Цена не
                            указана`
								}}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="cart-footer">
				<div class="cart-promo">
					<span>Применить промокод:</span>
					<div class="cart-promo__input">
						<input type="text" placeholder="Промокод" class="input" />
						<button>Применить</button>
					</div>
				</div>
				<div class="cart-total">
					<div class="cart-total__info">
						<span>Итого:</span>
						<span class="cart-total__price"
							>{{ Math.round(animatedTotalPrice) }} ₽</span
						>
					</div>

					<NuxtLink
						to="/checkout"
						:class="
							'btn btn-submit ' +
							(cartStore.items.length === 0 ? 'disabled' : '')
						"
					>
						<span>Оформить заказ</span>
					</NuxtLink>
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

.cart-promo {
	@include flex(column, flex-start, flex-start);

	span {
		font-size: 16px;
		color: $color-gray;
		font-weight: bold;
		margin-left: 42px;
	}

	&__input {
		width: 100%;
		padding: 26px 42px;
		font-size: auto-clamp(16px, 20px);
		border: none;
		outline: none;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
		background-color: #fcfcfc;
		color: inherit;

		input {
			border: none;
			background-color: #fcfcfc;
			font-weight: 700;
			color: $color-primary;
		}

		button {
			font-size: 18px;
		}
	}
}

.cart-footer {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 130px;
	margin-top: 72px;
	padding-top: 38px;
	border-top: 2px solid $color-border;
}

.checkout-btn {
	max-width: 430px;
}

.cart-total {
	font-size: 1.2rem;
	@include flex(column, flex-start, flex-end);
	flex: 1;

	&__info {
		@include flex(column, flex-start, flex-start);
		gap: 12px;
	}
}

.cart-total__price {
	font-weight: bold;
	font-size: 50px;
}

.cart-item {
	@include flex(row, flex-start, stretch);
	width: 100%;
	gap: auto-clamp(12px, 72px);
	background-color: #fcfcfc;
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
			margin-top: 14px;
		}
	}

	.cart-item__info {
		@include flex(row, space-between, stretch);
		flex: 1;
		height: auto;
		padding-bottom: 24px;

		.left {
			@include flex(column, flex-start, flex-start);
			height: auto;
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
