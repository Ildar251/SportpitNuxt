<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoritesStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoriteStore()
const cartItemCount = computed(() => cartStore.items.length)
const favoriteItemCount = computed(() => favoritesStore.items.length)
const tabs = [
	{ id: 'personal-data', label: 'Личные данные', icon: 'user' },
	{ id: 'order-history', label: 'История покупок', icon: 'history' },
	{ id: 'loyalty-program', label: 'Программа лояльности', icon: 'loyalty' },
	{ id: 'favorites', label: `Избранное (${favoriteItemCount.value})`, icon: 'favorites-head' },
	{ id: 'cart', label: `Корзина (${cartItemCount.value})`, icon: 'cart' },
	{ id: 'support', label: 'Поддержка', icon: 'support' },
]
const route = useRoute()
const activeTab = ref(route.query.tab === 'cart' ? 'cart' : tabs[0].id)

const contentRef = ref<HTMLElement | null>(null)
const currentHeight = ref('auto')

watch(activeTab, async () => {
	await nextTick() // Ждём ререндер нового контента
	if (contentRef.value) {
		const newHeight = contentRef.value.scrollHeight + 'px'
		currentHeight.value = newHeight
	}
})
const isInitialized = ref(false)

onMounted(async () => {
	await authStore.initialize()
	isInitialized.value = true
});

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
							</div>
						</div>

						<div v-else-if="activeTab === 'loyalty-program'" class="lk__content-item">
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Программа лояльности</h2>
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

	.tabs-lk {
		@include flex(column, flex-start, flex-start);
	}

	.lk__content {
		border-top: 2px solid $color-border;
		flex: 1;
		padding: 42px 0px 0px 42px;
		position: relative;
		overflow: hidden;
		transition: height 0.4s ease-in-out;

		.h2 {
			margin-bottom: 42px;
			font-size: auto-clamp(24px, 50px);
		}

		.lk__content-item {
			width: 100%;
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
