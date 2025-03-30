<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

// Интерфейс для ответа сервера
interface ApiResponse {
	success: boolean
	message: string
	order?: any // Опционально, если сервер возвращает данные заказа
}

import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, page } = usePage('checkout')

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const config = useRuntimeConfig()

// Проверяем авторизацию
if (!authStore.isAuthenticated) {
	router.push('/login')
}

// Реактивные переменные для выбора способа оплаты и доставки
const paymentOptions = [
	{ id: 'invoice', label: 'Оплата по счету' },
	{ id: 'cash', label: 'Оплата наличными' },
	{ id: 'sbp', label: 'Оплата по СБП' },
]
const paymentOptionsActive = ref(paymentOptions[0].id)

const deliveryOptions = [
	{ id: 'pickup', label: 'Самовывоз' },
	{ id: 'courier', label: 'Курьерская доставка' },
	{ id: 'transport', label: 'Транспортные компании' },
]
const deliveryOptionsActive = ref(deliveryOptions[0].id)

// Обработчик отправки заказа// Обработчик отправки заказа
const submitOrder = async () => {
	try {
		const paymentMethodLabel =
			paymentOptions.find(option => option.id === paymentOptionsActive.value)
				?.label || paymentOptionsActive.value
		const deliveryMethodLabel =
			deliveryOptions.find(option => option.id === deliveryOptionsActive.value)
				?.label || deliveryOptionsActive.value

		const orderData = {
			user: {
				name: authStore.user?.name,
				email: authStore.user?.email,
				phone: authStore.user?.phone,
			},
			items: cartStore.items,
			totalPrice: cartStore.totalPrice,
			paymentMethod: paymentMethodLabel,
			deliveryMethod: deliveryMethodLabel,
			createdAt: new Date().toISOString(),
		}
		console.log('Отправляемые данные:', orderData)
		console.log('API Token:', authStore.apiToken)

		const response = await $fetch<ApiResponse>(
			'https://test.top-nnov.ru/api/order',
			{
				method: 'POST',
				body: orderData,
				headers: {
					Authorization: `Bearer ${authStore.apiToken}`,
				},
			}
		)

		if (response.success) {
			// Начисляем бонусы перед очисткой корзины
			await authStore.addLoyaltyPoints(cartStore.totalPrice)
			cartStore.clearCart()
			toast.success('Заказ успешно оформлен!', { autoClose: 3000 })
			router.push({ path: '/lk', query: { tab: 'order-history' } })
		} else {
			toast.error(response.message || 'Ошибка при оформлении заказа', {
				autoClose: 3000,
			})
		}
	} catch (error) {
		console.error('Ошибка при отправке заказа:', error)
		toast.error('Произошла ошибка. Попробуйте снова', { autoClose: 3000 })
	}
}
</script>

<template>
	<main>
		<component
			v-for="section in sections"
			:is="sectionMap[section]"
			:key="section"
			:data="sectionsData[section]"
			:page="page"
		/>
		<section class="section section-checkout">
			<div class="container checkout">
				<div class="checkout__item personal-data">
					<h2 class="h2">Личные данные</h2>
					<div v-if="authStore.user" class="checkout__item-info">
						<p>
							<strong>Имя:</strong> {{ authStore.user.name || 'Не указано' }}
						</p>
						<p>
							<strong>Email:</strong> {{ authStore.user.email || 'Не указано' }}
						</p>
						<p>
							<strong>Телефон:</strong>
							{{ authStore.user.phone || 'Не указано' }}
						</p>
					</div>
				</div>

				<div class="checkout__item order-items">
					<h2 class="h2">Состав заказа</h2>
					<div v-if="cartStore.items.length === 0">Корзина пуста</div>
					<div v-else class="checkout__item-info items-list">
						<div
							v-for="item in cartStore.items"
							:key="item.id"
							class="order-item"
						>
							<div class="item-wrap">
								<NuxtImg
									:src="
										item.image
											? `${config.public.apiUrl}${item.image}`
											: '/placeholder.png'
									"
									:alt="item.title || 'Товар'"
									class="item-image"
									height="120"
								/>
								<div class="item-quantity">
									{{ item.quantity }}
								</div>
							</div>
							<div class="item-info">
								<span>{{ item.title || 'Без названия' }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- 3. Способ оплаты -->
				<div class="checkout__item payment-method">
					<h2 class="h2">Способ оплаты</h2>
					<div class="checkout__item-info options">
						<UiTabs
							:tabsClass="'tabs-payment'"
							:tabs="paymentOptions"
							v-model="paymentOptionsActive"
						/>
					</div>
				</div>

				<!-- 4. Способ доставки -->
				<div class="checkout__item delivery-method">
					<h2 class="h2">Способ доставки</h2>
					<div class="checkout__item-info options">
						<UiTabs
							:tabs-class="'tabs-delivery'"
							:tabs="deliveryOptions"
							v-model="deliveryOptionsActive"
						/>
						<Transition name="fade">
							<div v-if="deliveryOptionsActive === 'pickup'" class="pickup">
								<div class="info">
									<span>Вы можете забрать заказ по адресу</span>
									<h4 class="h4">
										Ермолаевский переулок, 22-26с1, Москва, 123001
									</h4>
								</div>
								<YaMap />
							</div>
							<div v-else-if="deliveryOptionsActive === 'courier'">
								<div class="info">
									<span>Вы можете забрать заказ по адресу</span>
									<h4 class="h4">
										Ермолаевский переулок, 22-26с1, Москва, 123001
									</h4>
								</div>
								<YaMap />
							</div>
							<div v-else-if="deliveryOptionsActive === 'transport'">
								<div class="info">
									<span>Доставка по России:</span>
									<p>
										Стоимость доставки рассчитывается в зависимости от веса
										товара и удаленности отправления. Если Вы не получили
										извещение о посылке из отделения Почты России, сообщите
										менеджеру магазина - выясним место нахождения посылки до
										истечения срока хранения. Почта России хранит заказы 30
										дней. Стоимость доставки рассчитывается в зависимости от
										веса товара и удаленности отправления.
									</p>
								</div>
							</div>
						</Transition>
					</div>
				</div>

				<div class="checkout__footer">
					<div class="warning">
						<NuxtIcon name="warning" />
						<div class="span">
							Доставка продукции<br />оплачивается отдельно
						</div>
					</div>
					<div class="total__info">
						<span class="total__text">Итого:</span>
						<span class="total__price">{{ cartStore.totalPrice }} ₽</span>
					</div>
					<button class="btn btn--fill" @click="submitOrder">
						<span>Оформить заказ</span>
					</button>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped lang="scss">
.checkout {
	.checkout__item {
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: 42px;
		border-top: 2px solid $color-border;

		&:not(:first-of-type) {
			margin-top: 100px;
		}

		.h2 {
			font-size: 42px;
			padding-top: 42px;
			position: relative;

			&::after {
				content: '';
				display: block;
				width: 2px;
				background-color: $color-border;
				height: 166px;
				position: absolute;
				top: 0;
				right: 0;
			}
		}

		&-info {
			padding-top: 42px;
		}
	}

	.items-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(116px, 116px));
		gap: 20px;

		.order-item {
			width: 100%;

			.item-wrap {
				@include flex(column, center, center);
				aspect-ratio: 1 / 1;
				object-fit: contain;
				object-position: center 30px;
				background-color: $color-light;
				margin-bottom: 12px;
				position: relative;

				.item-image {
					object-fit: contain;
					object-position: center 30px;
					height: 100%;
				}
			}

			.item-quantity {
				font-size: 14px;
				font-weight: 700;
				color: $color-gray;
				border-radius: 50%;
				background-color: $color-accent;
				position: absolute;
				width: 32px;
				height: 32px;
				@include flex(row, center, center);
				top: 12px;
				right: -16px;
				color: $color-white;
				font-size: 24px;
				line-height: 1;
			}

			.item-info {
				font-size: 14px;
				font-weight: 700;
				color: $color-gray;
			}
		}
	}

	.info {
		background-color: $color-light;
		padding: 42px;

		margin-bottom: 12px;

		span {
			display: block;
			font-weight: 700;
			margin-bottom: 24px;
			padding-bottom: 24px;
			border-bottom: 2px solid $color-border;
			width: fit-content;
			font-size: 20px;
		}

		.h4 {
			font-size: auto-clamp(24px, 32px);
			color: $color-gray;
		}

		p {
			color: $color-gray;
		}
	}

	.checkout__footer {
		font-size: 1.2rem;
		@include flex(row, flex-end, center);
		gap: auto-clamp(40px, 120px);
		margin-top: 72px;

		.btn {
			margin-top: 0;
		}

		.total__info {
			@include flex(column, flex-start, flex-start);
			gap: 0px;

			.total__text {
				font-size: auto-clamp(16px, 20px);
				color: $color-gray;
			}
		}
	}

	.warning {
		@include flex(row, flex-start, center);
		gap: 12px;
		color: $color-red;
		font-size: auto-clamp(16px, 20px);
		font-weight: 700;
		max-width: 240px;
	}

	.total__price {
		font-weight: bold;
		font-size: auto-clamp(24px, 50px);
	}
}
</style>
