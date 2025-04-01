<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoritesStore'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const cartItemCount = computed(() => cartStore.items.length)
const favoriteItemCount = computed(() => favoriteStore.items.length)

interface Order {
	order_id: string
	items: Array<{
		id: number
		title: string
		price: number | string
		image: string
		volume: number | string
		quantity: number
	}>
	total_price: number
	payment_method: string
	delivery_method: string
	created_at: string
	status: string
}

// Список вкладок
const tabs = computed(() => [
	{ id: 'personal-data', label: 'Личные данные', icon: 'user' },
	{ id: 'order-history', label: 'История покупок', icon: 'history' },
	{ id: 'loyalty-program', label: 'Программа лояльности', icon: 'loyalty' },
	{ id: 'favorites', label: `Избранное (${favoriteItemCount.value})`, icon: 'favorites-head' },
	{ id: 'cart', label: `Корзина (${cartItemCount.value})`, icon: 'cart' },
	{ id: 'support', label: 'Поддержка', icon: 'support' },
])

// Активная вкладка
const route = useRoute()
const activeTab = ref(route.query.tab === 'cart' ? 'cart' : tabs.value[0].id)
const isInitialized = ref(false)

// Ref для экземпляра Swiper
const swiperRef = ref<SwiperType | null>(null)

// При изменении слайда обновляем activeTab
const onSlideChange = (swiper: SwiperType) => {
	const activeIndex = swiper.activeIndex
	activeTab.value = tabs.value[activeIndex].id
}

// Функция для переключения слайда при клике на таб
const setActiveTab = (tabId: string) => {
	const index = tabs.value.findIndex(tab => tab.id === tabId)
	if (index !== -1 && swiperRef.value) {
		swiperRef.value.slideTo(index)
		activeTab.value = tabId
	}
}

// Загрузка заказов
const orders = ref<Order[]>([])
const isLoadingOrders = ref(false)

const fetchOrders = async () => {
	isLoadingOrders.value = true
	try {
		const response = await $fetch<{
			success: boolean
			message: string
			orders: Order[]
		}>('https://test.top-nnov.ru/api/orders', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${authStore.apiToken}`,
			},
		})
		if (response.success) {
			orders.value = response.orders
		} else {
			console.error('Ошибка получения заказов:', response.message)
		}
	} catch (error) {
		console.error('Ошибка при загрузке заказов:', error)
	} finally {
		isLoadingOrders.value = false
	}
}

onMounted(async () => {
	await authStore.initialize()
	isInitialized.value = true
	if (activeTab.value === 'order-history' && authStore.apiToken) {
		await fetchOrders()
	}
})

watch(activeTab, async (newTab) => {
	if (newTab === 'order-history' && authStore.apiToken) {
		await fetchOrders()
	}
})
</script>

<template>
	<section class="section section-lk" v-if="isInitialized">
		<div class="container">
			<div class="lk">
				<UiTabs v-model="activeTab" :tabsClass="'tabs-lk'" :tabs="tabs" @update:model-value="setActiveTab" />
				<Swiper :modules="[EffectCoverflow]" :slidesPerView="1" :spaceBetween="20" :effect="'coverflow'"
					:coverflowEffect="{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false }"
					class="lk__content" :auto-height="true" @swiper="(swiper) => (swiperRef = swiper)"
					@slideChange="onSlideChange" :speed="700">
					<SwiperSlide>
						<div class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Личные данные</h2>
								<LkUser />
							</div>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">История покупок</h2>
								<LkOrders :orders="orders" :is-loading="isLoadingOrders" />
							</div>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Программа лояльности</h2>
								<LkLoyalty />
							</div>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div class="lk__content-item">
							<h2 class="h2">Избранное</h2>
							<LkFavorites />
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div class="lk__content-item">
							<h2 class="h2">Корзина</h2>
							<LkCart />
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div class="lk__content-item">
							<h2 class="h2">Поддержка</h2>
							<LkHelp />
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.lk {
	@include flex(row, flex-start, flex-start);
	gap: 44px;
	padding-top: 44px;

	@media screen and (max-width: 768px) {
		flex-direction: column;
		padding-top: 10px;
	}

	.lk__content {
		border-top: 2px solid $color-border;
		flex: 1;
		position: relative;
		overflow: hidden;
		transition: height 0.4s ease-in-out;

		@media screen and (max-width: 768px) {
			width: 100%;
		}

		.h2 {
			margin-bottom: 42px;
			font-size: auto-clamp(24px, 50px);
		}

		.lk__content-item {
			margin: 42px 0px 0px 42px;
			width: calc(100% - 45px);

			@media screen and (max-width: 768px) {
				margin: 20px 0px;
				width: 100%;
			}
		}
	}
}
</style>
