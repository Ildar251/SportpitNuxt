<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoritesStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const favoritesStore = useFavoriteStore()

const tabs = [
	{ id: 'personal-data', label: 'Личные данные', icon: 'user' },
	{ id: 'order-history', label: 'История покупок', icon: 'history' },
	{ id: 'loyalty-program', label: 'Программа лояльности', icon: 'loyalty' },
	{ id: 'favorites', label: `Избранное`, icon: 'favorites-head' },
	{ id: 'cart', label: `Корзина (${cartStore.items.length})`, icon: 'cart' },
	{ id: 'support', label: 'Поддержка', icon: 'support' },
]
const activeTab = ref(tabs[0].id)
</script>

<template>
	<section class="section section-lk">
		<div class="container">
			<div class="lk">
				<UiTabs v-model="activeTab" :tabsClass="'tabs-lk'" :tabs="tabs" />
				<div class="lk__content">
					<Transition name="slide-right">
						<div
							v-if="activeTab === 'personal-data'"
							class="lk__content-item active"
						>
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">Личные данные</h2>
								<div class="personal__info">
									<div class="personal__info-item">
										{{ authStore.user?.name }}
									</div>
									<div class="personal__info-item">
										{{ authStore.user?.surname }}
									</div>
									<div class="personal__info-item">
										{{ authStore.user?.phone }}
									</div>
									<div class="personal__info-item">
										{{ authStore.user?.email }}
									</div>
									<div class="personal__info-item">
										{{ authStore.user?.inn }}
									</div>
								</div>
								<div class="btn logout" @click="authStore.logout">
									<NuxtIcon name="logout" />
									<span>Выйти из аккаунта</span>
								</div>
							</div>
						</div>

						<div
							v-else-if="activeTab === 'order-history'"
							class="lk__content-item"
						>
							<LkNoAuth v-if="!authStore.apiToken" />
							<div v-else>
								<h2 class="h2">История покупок</h2>
							</div>
						</div>

						<div
							v-else-if="activeTab === 'loyalty-program'"
							class="lk__content-item"
						>
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
		min-height: 500px;

		.h2 {
			margin-bottom: 42px;
			font-size: auto-clamp(24px, 50px);
		}

		.lk__content-item {
			position: absolute;
			inset: 42px;
		}

		.personal__info {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 40px;

			&-item {
				padding: 26px 42px;
				background-color: #fcfcfc;
				font-size: 24px;
				flex: 1;
			}
		}

		.logout {
			@include flex(row, flex-start, center);
			gap: 12px;
			margin-top: 42px;
			font-size: 20px;
			color: $color-gray;
			cursor: pointer;

			&:hover {
				color: $color-accent;
			}
		}
	}
}
</style>
