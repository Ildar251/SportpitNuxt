<script setup lang="ts">
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
	{
		id: 'favorites',
		label: `Избранное (${favoriteItemCount.value})`,
		icon: 'favorites-head',
	},
	{ id: 'cart', label: `Корзина (${cartItemCount.value})`, icon: 'cart' },
	{ id: 'support', label: 'Поддержка', icon: 'support' },
])

// Активная вкладка и высота контента
const route = useRoute()
const activeTab = ref(route.query.tab === 'cart' ? 'cart' : tabs.value[0].id)
const contentRef = ref<HTMLElement | null>(null)
const currentHeight = ref('auto')
const isInitialized = ref(false)

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

const updateHeight = async () => {
	await nextTick()
	if (contentRef.value) {
		currentHeight.value = `${contentRef.value.scrollHeight}px`
	}
}

onMounted(async () => {
	await authStore.initialize()
	isInitialized.value = true
})

watch(activeTab, async newTab => {
	if (newTab === 'order-history' && authStore.apiToken) {
		await fetchOrders()
	}
	updateHeight()
})
</script>

<template>
	<section class="section section-lk" v-if="isInitialized">
		<div class="container">
			<div class="lk">
				<UiTabs v-model="activeTab" :tabsClass="'tabs-lk'" :tabs="tabs" />

				<div ref="contentRef" class="lk__content" :style="{ height: currentHeight }">
					<Transition name="slide-right-absolute">
						<div v-if="activeTab === 'personal-data'" class="lk__content-item active">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Личные данные</h2>
								<LkUser />
							</div>
						</div>

						<div v-else-if="activeTab === 'order-history'" class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">История покупок</h2>
								<LkOrders :orders="orders" :is-loading="isLoadingOrders"
									@height-changed="updateHeight" />
							</div>
						</div>

						<div v-else-if="activeTab === 'loyalty-program'" class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Программа лояльности</h2>
								<LkLoyalty />
							</div>
						</div>

						<div v-else-if="activeTab === 'favorites'" class="lk__content-item">
							<div>
								<h2 class="h2">Избранное</h2>
								<LkFavorites />
							</div>
						</div>

						<div v-else-if="activeTab === 'cart'" class="lk__content-item">
							<div>
								<h2 class="h2">Корзина</h2>
								<LkCart />
							</div>
						</div>

						<div v-else-if="activeTab === 'support'" class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Поддержка</h2>
							</div>
						</div>
					</Transition>
				</div>
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

.slide-right-absolute-enter-active,
.slide-right-absolute-leave-active {
	transition: transform 0.4s ease-in-out, opacity 0.3s ease;
	position: absolute;
}

.slide-right-absolute-enter-from {
	transform: translateX(100%);
	opacity: 0;
	position: absolute;
}

.slide-right-absolute-leave-to {
	transform: translateX(100%);
	opacity: 0;
}
</style>
