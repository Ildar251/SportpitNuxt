<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useYandexMaps } from '~/composables/useYandexMaps'


import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

// Интерфейс для ответа сервера
interface ApiResponse {
	success: boolean
	message: string
	order?: any
}

interface PromoCode {
	MIGX_id: string
	promo: string
	discount: string
	minOrder?: string
	expires?: string
}

interface DaDataResponse {
	suggestions: DaDataSuggestion[]
}

interface DaDataSuggestion {
	value: string
	data: {
		geo_lat: string
		geo_lon: string
	}
}

import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('checkout')
useHead({
	title: pageTitle,
	meta: [
		{ name: 'description', content: pageDescription },
		{ property: 'og:title', content: pageTitle },
		{ property: 'og:description', content: pageDescription },
		{ property: 'og:type', content: 'website' },
	],
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const config = useRuntimeConfig()

// Загружаем Yandex Maps API
const { loadYandexMaps, isYandexMapsLoaded } = useYandexMaps()
onMounted(() => {
	const apiKey = config.public.yandexMapsApiKey
	if (!apiKey) {
		console.error('Yandex Maps API ключ не найден в конфигурации!')
		return
	}

	const yandexMapsPromise = loadYandexMaps(apiKey)
	if (yandexMapsPromise) {
		yandexMapsPromise.catch((error) => {
			console.error('Не удалось загрузить Yandex Maps API:', error)
		})
	} else {
		console.error('Yandex Maps API уже загружен или не может быть загружен.')
	}
})

// Проверяем авторизацию
if (!authStore.isAuthenticated) {
	router.push('/login')
}

// Реактивные переменные для личных данных, изначально берём из профиля
const userSurname = ref<string>(authStore.user?.surname || '')
const userName = ref<string>(authStore.user?.name || '')
const userEmail = ref<string>(authStore.user?.email || '')
const userPhone = ref<string>(authStore.user?.phone || '')
const company = ref<string>('')
const orderComment = ref<string>('')

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

const swiperRef = ref<SwiperType | null>(null)

// При изменении слайда обновляем deliveryOptionsActive
const onSlideChange = (swiper: SwiperType) => {
	const activeIndex = swiper.activeIndex
	deliveryOptionsActive.value = deliveryOptions[activeIndex].id
}

// Функция для переключения слайда при клике на таб
const setActiveTab = (tabId: string) => {
	const index = deliveryOptions.findIndex(tab => tab.id === tabId)
	if (index !== -1 && swiperRef.value) {
		swiperRef.value.slideTo(index)
		deliveryOptionsActive.value = tabId
	}
}

// Реактивные переменные для адреса доставки
const deliveryAddress = ref<string>('')
const addressSuggestions = ref<DaDataSuggestion[]>([])

// Функция для получения подсказок адреса через DaData
const fetchAddressSuggestions = async (query: string) => {
	if (!query) {
		addressSuggestions.value = []
		return
	}

	try {
		const response = await $fetch<DaDataResponse>('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Token ${config.public.dadataApiKey}`,
			},
			body: {
				query,
				count: 5,
			},
		})
		addressSuggestions.value = response.suggestions || []
	} catch (error) {
		console.error('Ошибка при получении подсказок адреса:', error)
		addressSuggestions.value = []
	}
}

// Обработчик выбора адреса
const selectAddress = (suggestion: DaDataSuggestion) => {
	deliveryAddress.value = suggestion.value
	const lat = parseFloat(suggestion.data.geo_lat)
	const lon = parseFloat(suggestion.data.geo_lon)
	if (lat && lon) {
		deliveryCoordinates.value = [lat, lon]
	}
	addressSuggestions.value = []
}

// Следим за изменениями в поле адреса
watch(deliveryAddress, (newValue) => {
	fetchAddressSuggestions(newValue)
})

// Реактивные переменные для промокода
const promoCodeInput = ref<string>('')
const appliedPromoCode = ref<string | null>(null)
const discount = ref<number>(0)
const promoError = ref<string | null>(null)

// Доступные промокоды (берём из page.tvFields.promo)
const availablePromoCodes = computed<PromoCode[]>(() => {
	if (page.value?.tvFields?.promo) {
		try {
			return JSON.parse(page.value.tvFields.promo)
		} catch (err) {
			console.error('Ошибка парсинга промокодов:', err)
			return []
		}
	}
	return []
})

// Итоговая сумма с учётом скидки
const finalPrice = computed(() => {
	const total = cartStore.totalPrice
	if (discount.value > 0) {
		const discountAmount = total * (discount.value / 100)
		return Math.max(0, total - discountAmount)
	}
	return total
})

// Функция применения промокода
const applyPromoCode = () => {
	const code = promoCodeInput.value.trim().toLowerCase()
	if (!code) {
		promoError.value = 'Введите промокод'
		return
	}

	const promo = availablePromoCodes.value.find(p => p.promo.toLowerCase() === code)
	if (!promo) {
		toast.error(`Промокод недействителен`)
		return
	}

	const minOrder = promo.minOrder ? parseFloat(promo.minOrder) : 0
	if (minOrder > 0 && cartStore.totalPrice < minOrder) {
		toast.error(`Минимальная сумма заказа для этого промокода — ${minOrder} ₽. Текущая сумма: ${cartStore.totalPrice} ₽`)
		return
	}

	if (promo.expires) {
		const expirationDate = new Date(promo.expires)
		const currentDate = new Date()
		if (currentDate > expirationDate) {
			promoError.value = 'Срок действия промокода истёк'
			return
		}
	}

	appliedPromoCode.value = promo.promo
	discount.value = parseFloat(promo.discount)
	promoError.value = null
	toast.success(`Промокод ${promo.promo} применён! Скидка ${promo.discount}%`, {
		autoClose: 3000,
	})
}

// Функция сброса промокода
const resetPromoCode = () => {
	promoCodeInput.value = ''
	appliedPromoCode.value = null
	discount.value = 0
	promoError.value = null
}

// Обработчик отправки заказа
const submitOrder = async () => {
	if (!userSurname.value.trim()) {
		toast.error('Пожалуйста, укажите вашу фамилию', { autoClose: 3000 })
		return
	}
	if (!userName.value.trim()) {
		toast.error('Пожалуйста, укажите ваше имя', { autoClose: 3000 })
		return
	}
	if (!userEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value)) {
		toast.error('Пожалуйста, укажите корректный email', { autoClose: 3000 })
		return
	}
	if (!userPhone.value.trim() || !/^\+?\d{10,15}$/.test(userPhone.value)) {
		toast.error('Пожалуйста, укажите корректный номер телефона', { autoClose: 3000 })
		return
	}
	if (!company.value.trim()) {
		toast.error('Пожалуйста, укажите название компании', { autoClose: 3000 })
		return
	}
	if (deliveryOptionsActive.value === 'courier' && !deliveryAddress.value.trim()) {
		toast.error('Пожалуйста, укажите адрес доставки', { autoClose: 3000 })
		return
	}

	try {
		const paymentMethodLabel =
			paymentOptions.find(option => option.id === paymentOptionsActive.value)?.label || paymentOptionsActive.value
		const deliveryMethodLabel =
			deliveryOptions.find(option => option.id === deliveryOptionsActive.value)?.label || deliveryOptionsActive.value

		const orderData = {
			user: {
				surname: userSurname.value,
				name: userName.value,
				email: userEmail.value,
				phone: userPhone.value,
				company: company.value,
			},
			comment: orderComment.value,
			items: cartStore.items,
			totalPrice: cartStore.totalPrice,
			finalPrice: finalPrice.value,
			promoCode: appliedPromoCode.value,
			discount: discount.value,
			paymentMethod: paymentMethodLabel,
			deliveryMethod: deliveryMethodLabel,
			deliveryAddress: deliveryOptionsActive.value === 'courier' ? deliveryAddress.value : undefined,
			deliveryCoordinates: deliveryOptionsActive.value === 'courier' ? deliveryCoordinates.value : undefined,
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
			await authStore.addLoyaltyPoints(finalPrice.value)
			cartStore.clearCart()
			resetPromoCode()
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

const deliveryCoordinates = ref<[number, number] | null>(null)

// Определяем mapCenter с явным типом
const mapCenter = computed<[number, number]>(() => {
	if (deliveryOptionsActive.value === 'pickup') {
		return [55.766030, 37.594396]
	} else if (deliveryOptionsActive.value === 'courier') {
		return deliveryCoordinates.value || [55.7558, 37.6173]
	}
	return [55.7558, 37.6173] // дефолтное значение
})

// Определяем mapPlacemark с явным типом
const mapPlacemark = computed<[number, number] | undefined>(() => {
	if (deliveryOptionsActive.value === 'pickup') {
		return [55.766030, 37.594396]
	} else if (deliveryOptionsActive.value === 'courier') {
		return deliveryCoordinates.value ?? undefined
	}
	return undefined
})
</script>

<template>
	<main>
		<component v-for="section in sections" :is="sectionMap[section]" :key="section" :data="sectionsData[section]"
			:page="page" />
		<section class="section section-checkout">
			<div class="container checkout">
				<div class="checkout__item personal-data">
					<h2 class="h2">Личные данные</h2>
					<div class="checkout__item-info">
						<div class="form-group">
							<label for="surname">Фамилия:</label>
							<input id="surname" v-model="userSurname" type="text" class="input"
								placeholder="Введите вашу фамилию" required />
						</div>
						<div class="form-group">
							<label for="name">Имя:</label>
							<input id="name" v-model="userName" type="text" class="input" placeholder="Введите ваше имя"
								required />
						</div>
						<div class="form-group">
							<label for="email">Email:</label>
							<input id="email" v-model="userEmail" type="email" class="input"
								placeholder="Введите ваш email" required />
						</div>
						<div class="form-group">
							<label for="phone">Телефон:</label>
							<input id="phone" v-model="userPhone" type="tel" class="input"
								placeholder="Введите ваш телефон" required />
						</div>
						<div class="form-group">
							<label for="company">Компания:</label>
							<input id="company" v-model="company" type="text" class="input"
								placeholder="Введите название компании" required />
						</div>
						<div class="form-group">
							<label for="comment">Комментарий к заказу:</label>
							<textarea id="comment" v-model="orderComment" class="textarea"
								placeholder="Введите ваш комментарий (необязательно)" rows="4"
								maxlength="500"></textarea>
						</div>
					</div>
				</div>

				<div class="checkout__item order-items">
					<h2 class="h2">Состав заказа</h2>
					<div v-if="cartStore.items.length === 0">Корзина пуста</div>
					<div v-else class="checkout__item-info items-list">
						<div v-for="item in cartStore.items" :key="item.id" class="order-item">
							<div class="item-wrap">
								<NuxtImg :src="item.image ? `${config.public.apiUrl}${item.image}` : 'images/box.svg'"
									:alt="item.title || 'Товар'" class="item-image" height="120" />
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
						<UiTabs :tabsClass="'tabs-payment'" :tabs="paymentOptions" v-model="paymentOptionsActive" />
					</div>
				</div>

				<!-- 4. Способ доставки -->
				<div class="checkout__item delivery-method">
					<h2 class="h2">Способ доставки</h2>
					<div class="checkout__item-info options">
						<UiTabs :tabs-class="'tabs-delivery'" :tabs="deliveryOptions" v-model="deliveryOptionsActive"
							@update:model-value="setActiveTab" />
						<Swiper :modules="[EffectFade]" :slidesPerView="1" :spaceBetween="20" :effect="'fade'"
							:fadeEffect="{ crossFade: true }" :auto-height="true" class="delivery-slider"
							@swiper="(swiper) => (swiperRef = swiper)" @slideChange="onSlideChange" :speed="700">
							<SwiperSlide>
								<div class="pickup">
									<div class="info">
										<span>Вы можете забрать заказ по адресу</span>
										<h4 class="h4">Ермолаевский переулок, 22-26с1, Москва, 123001</h4>
									</div>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div class="courier">
									<div class="info">
										<span>Укажите Ваш адрес</span>
										<div class="form-group">
											<input v-model="deliveryAddress" type="text" class="input"
												placeholder="Введите адрес доставки" required />
											<ul v-if="addressSuggestions.length" class="suggestions">
												<li v-for="suggestion in addressSuggestions" :key="suggestion.value"
													@click="selectAddress(suggestion)">
													{{ suggestion.value }}
												</li>
											</ul>
										</div>
									</div>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div class="transport">
									<div class="info">
										<span>Доставка по России:</span>
										<p>
											Стоимость доставки рассчитывается в зависимости от веса товара и удаленности
											отправления...
										</p>
									</div>
								</div>
							</SwiperSlide>
						</Swiper>
						<!-- Карта вне Swiper -->
						<YaMap
							v-if="isYandexMapsLoaded && (deliveryOptionsActive === 'pickup' || deliveryOptionsActive === 'courier')"
							:center="mapCenter" :placemark="mapPlacemark" />
						<div v-else-if="deliveryOptionsActive !== 'transport'">Загрузка карты...</div>
					</div>
				</div>

				<div class="checkout__footer">
					<div class="cart-promo">
						<span>Применить промокод:</span>
						<div class="cart-promo__input">
							<input v-model="promoCodeInput" type="text" placeholder="Промокод" class="input"
								:disabled="!!appliedPromoCode" @keyup.enter="applyPromoCode" />
							<button v-if="!appliedPromoCode" @click="applyPromoCode">
								Применить
							</button>
							<button v-else @click="resetPromoCode">Отменить</button>
						</div>
					</div>
					<div class="warning">
						<NuxtIcon name="warning" />
						<div class="span">
							Доставка продукции<br />оплачивается отдельно
						</div>
					</div>
					<div class="total__info">
						<span class="total__text">Итого:</span>
						<span class="total__price">
							{{ finalPrice }} ₽
							<Transition name="fade">
								<span v-if="discount" class="original-price">
									{{ cartStore.totalPrice }} ₽
								</span>
							</Transition>
						</span>
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
.delivery-method {
	.checkout__item-info {
		max-width: 100%;
		overflow: hidden;
	}
}



.suggestions {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	z-index: 10;
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	margin: 4px 0;
	padding: 0;
	list-style: none;
	max-height: 200px;
	overflow-y: auto;
}

.suggestions li {
	padding: 8px 12px;
	cursor: pointer;
	font-size: 14px;
	color: #333;
	transition: background 0.2s;
}

.suggestions li:hover {
	background: #f5f5f5;
}

.form-group {
	margin-bottom: 1rem;
	position: relative;
}

.form-group label {
	display: block;
	color: $color-gray;
	padding: 0px 42px;
	margin-bottom: 0.5rem;
}

.form-group input {
	width: 100%;
	padding: 26px 42px;
	border: none;
	background-color: #fcfcfc;
	transition: $transition;
	color: $color-primary;
}

.form-group textarea {
	width: 100%;
	padding: 26px 42px;
	border: none;
	background-color: #fcfcfc;
	transition: $transition;
}

.form-group input:focus {
	outline: none;
	border-color: $color-accent;
	box-shadow: 0 0 5px $color-accent;
}

.cart-promo {
	@include flex(column, flex-start, flex-start);

	span {
		font-size: 16px;
		color: $color-gray;
		font-weight: bold;
		margin-left: 42px;

		@media screen and (max-width: 768px) {
			margin-left: 10px;
		}
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
		@include flex(row, space-between, center);


		@media screen and (max-width: 768px) {
			padding: 26px 10px;
		}

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

.checkout {
	.checkout__item {
		display: grid;
		grid-template-columns: auto-clamp(280px, 400px) 1fr;
		gap: 42px;
		border-top: 2px solid $color-border;

		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 10px;
		}

		&:not(:first-of-type) {
			margin-top: auto-clamp(40px, 100px);
		}

		.h2 {
			font-size: auto-clamp(28px, 42px);
			padding-top: auto-clamp(28px, 42px);
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

				@media screen and (max-width: 768px) {
					display: none;
				}
			}
		}

		&-info {
			padding-top: auto-clamp(28px, 42px);
		}
	}

	.items-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));
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
			font-size: auto-clamp(20px, 32px);
			color: $color-gray;
		}

		p {
			color: $color-gray;
		}
	}

	.checkout__footer {
		font-size: 1.2rem;
		@include flex(row, flex-end, center);
		flex-wrap: wrap;
		gap: 20px auto-clamp(40px, 100px);
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

		@include flex(column, flex-end, flex-end);

		.original-price {
			font-size: 20px;
			color: $color-gray;
			text-decoration: line-through;
		}
	}
}
</style>
