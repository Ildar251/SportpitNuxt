<script lang="ts" setup>
import { NuxtLink } from '#components'
import gsap from 'gsap'
import { useAuthStore } from '~/stores/authStore'
import { useMenuStore } from '~/stores/useMenuStore'
import { useMobileMenuStore } from '~/stores/useMobileMenuStore'
import { useModalStore } from '~/stores/useModalStore'

const favoriteStore = useFavoriteStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const modalStore = useModalStore()
const menuStore = useMenuStore()
const mobileMenuStore = useMobileMenuStore()

import { useSiteSettings } from '~/composables/useSiteSettings'
const settings = useSiteSettings()


const favoritesCount = computed(() => favoriteStore.items.length)

const cartCount = computed(() => {
	return cartStore.items.reduce((total, item) => total + item.quantity, 0)
})

onMounted(() => {
	favoriteStore.loadFavorites()
	cartStore.loadCart()
})


const logout = () => {
	authStore.logout()
}

watch(
	() => mobileMenuStore.isOpen,
	isOpen => {
		if (isOpen) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}
	}
)

onMounted(() => {
	window.addEventListener('preloadComplete', () => {
		gsap.fromTo(
			'.header',
			{ opacity: 0, y: -60 },
			{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
		)
	})
})


const searchModalStore = useSearchModalStore()
const apiStore = useApiStore()

// Открываем модальное окно поиска
const openSearchModal = () => {
	// Убедимся, что товары загружены
	if (!apiStore.products.length) {
		apiStore.fetchProducts()
	}
	searchModalStore.open()
}

const config = useRuntimeConfig()


onMounted(() => {
	apiStore.fetchBrands()
	apiStore.fetchStocks()
})

const brands = computed(() => apiStore.brands)
const stocks = computed(() => apiStore.stocks)
</script>
<template>
	<header class="header">
		<div class="container header__top">
			<div class="header__contacts">
				<NuxtLink :to="settings.telegram" target="_blank" class="header__link link">
					telegram
				</NuxtLink>
				<NuxtLink :to="settings.whatsapp" target="_blank" class="header__link link">
					whatsapp
				</NuxtLink>
				<NuxtLink :to="settings.vk" target="_blank" class="header__link link">
					vk
				</NuxtLink>
				<a :href="'mailto:' + settings.email" class="header__link link">
					{{ settings.email }}
				</a>
			</div>

			<a :href="'tel:' + settings.phone" class="header__phone">
				<NuxtIcon name="phone" />
				<span>{{ settings.phone }}</span>
			</a>

			<div class="header__items">
				<NuxtLink to="/lk?tab=favorites" class="header__favorites">
					<NuxtIcon name="favorites-head" />
					<span class="header__favorites-count" v-if="favoritesCount">{{ favoritesCount }}</span>
				</NuxtLink>

				<NuxtLink to="/lk?tab=cart" class="header__cart">
					<NuxtIcon name="cart" />
					<span>Корзина</span>
					<span class="header__cart-count" v-if="cartCount">{{ cartCount }}</span>
				</NuxtLink>

				<ClientOnly>
					<NuxtLink v-if="!authStore.apiToken" to="#" class="header__lk" @click.prevent="modalStore.open">
						<NuxtIcon name="lk" />
						<span class="full-text">Личный кабинет</span>
						<span class="short-text">ЛК</span>
					</NuxtLink>

					<NuxtLink v-else class="header__lk" to="/lk">
						<NuxtIcon name="lk" />
						<span class="header__email">{{ authStore.user?.email }}</span>
					</NuxtLink>
				</ClientOnly>
			</div>
		</div>
		<div class="container container__bottom">
			<div class="header__logo">
				<NuxtLink to="/">
					<NuxtImg src="images/logo.svg" alt="logo" />
				</NuxtLink>
			</div>

			<div class="header__items header__items-mobile">
				<NuxtLink to="/lk?tab=favorites" class="header__favorites">
					<NuxtIcon name="favorites-head" />
					<span class="header__favorites-count" v-if="favoritesCount">{{ favoritesCount }}</span>
				</NuxtLink>

				<NuxtLink to="/lk?tab=cart" class="header__cart">
					<NuxtIcon name="cart" />
					<span class="header__cart-count" v-if="cartCount">{{ cartCount }}</span>
				</NuxtLink>
			</div>

			<nav class="header__nav">
				<div class="header__catalog">
					<div :class="'burger burger_catalog' + (menuStore.isOpen ? ' open' : '')" @click="menuStore.toggle">
						<div class="icon-left"></div>
						<div class="icon-right"></div>
					</div>
					<NuxtLink to="/catalog" class="header__menu-item"><span>Каталог</span></NuxtLink>
				</div>
				<ul class="header__menu">
					<li class="header__menu-item">
						<NuxtLink to="/stocks"><span>Акции</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/about"><span>Компания</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/partners"><span>Партнёрам</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/ctm"><span>CTM</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/delivery-and-payment"><span>Оплата</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/contacts"><span>Контакты</span></NuxtLink>
					</li>
				</ul>
			</nav>

			<div class="header__search">
				<button class="header__search-button" @click="openSearchModal">
					<NuxtIcon name="search" />
				</button>
			</div>

			<div :class="'burger burger_mobile' + (mobileMenuStore.isOpen ? ' open' : '')
				" @click="mobileMenuStore.toggle">
				<div class="icon-left"></div>
				<div class="icon-right"></div>
			</div>
		</div>

		<Transition name="slide-down">
			<div class="menu" v-if="menuStore.isOpen">
				<div class="container menu__container">
					<div class="menu__brands">
						<div class="menu__brands-title">
							Бренды
						</div>
						<div v-for="brand in brands" :key="brand.id">
							<NuxtLink :to="`${brand.alias}`" class="link">
								{{ brand.title }}
							</NuxtLink>
						</div>
					</div>
					<div class="menu__column">
						<NuxtLink :to="{ path: '/catalog', query: { category: 'Напитки' } }" class="menu__column-title">
							Напитки</NuxtLink>
					</div>
					<div class="menu__column">
						<NuxtLink :to="{ path: '/catalog', query: { category: 'Энергетики' } }"
							class="menu__column-title">Энергетики</NuxtLink>
					</div>
					<div class="menu__column">
						<NuxtLink :to="{ path: '/catalog', query: { category: 'Батончики' } }"
							class="menu__column-title">Батончики</NuxtLink>
					</div>

					<div class="menu__stocks">
						<NuxtLink :to="'/stocks/' + stock.alias" class="menu__stocks-item" v-for="stock in stocks"
							:key="stock.id" :style="{
								backgroundImage: `url(${config.public.apiUrl + stock.tvFields.stock_image
									})`,
							}">
							<div class="stocks__item-date">{{ stock.tvFields.stock_date }}</div>
							<h3 class="h3">{{ stock.title }}</h3>
						</NuxtLink>
					</div>
				</div>
			</div>
		</Transition>

		<Transition name="slide-right">
			<div class="menu menu-mobile" v-if="mobileMenuStore.isOpen">
				<div class="container menu__container">
					<nav class="header__nav-mobile">
						<ul class="header__menu">
							<li class="header__menu-item">
								<NuxtLink to="/stocks" @click="mobileMenuStore.close"><span>Акции</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/about" @click="mobileMenuStore.close"><span>Компания</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/partners" @click="mobileMenuStore.close"><span>Партнёрам</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/ctm" @click="mobileMenuStore.close"><span>CTM</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/delivery-and-payment" @click="mobileMenuStore.close"><span>Оплата</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/contacts" @click="mobileMenuStore.close"><span>Контакты</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>

						</ul>
					</nav>

					<div class="links">
						<a :href="settings.telegram" class="link">telegram</a>
						<a :href="settings.whatsapp" class="link">whatsapp</a>
						<a :href="settings.vk" class="link">vk</a>
					</div>

					<a :href="'tel:' + settings.phone" class="header__link">
						<NuxtIcon name="phone" />
						<span>{{ settings.phone }}</span>
					</a>

					<a :href="'mailto:' + settings.email" class="header__link ">
						{{ settings.email }}
					</a>
				</div>
			</div>
		</Transition>
	</header>
</template>

<style lang="scss" scoped>
.header {
	position: sticky;
	top: calc(auto-clamp(54px, 90px) * -1);
	background-color: $color-white;
	width: 100%;
	z-index: 100;
	white-space: nowrap;

	@media screen and (max-width: 856px) {
		top: 0;
	}

	.header__logo {
		width: auto-clamp(140px, 260px);
		margin-right: auto-clamp(20px, 40px);
		@include flex(row, flex-start, center);
	}

	&__favorites,
	&__cart {
		position: relative;

		&-count {
			position: absolute;
			@include flex(row, center, center);
			width: 24px;
			height: 24px;
			background-color: $color-accent;
			color: $color-white;
			border-radius: 50%;
			top: auto-clamp(6px, 12px);
			left: auto-clamp(40px, 80px);
		}
	}

	.container {
		display: flex;
		justify-content: space-between;

		&:not(.menu__container) {
			align-items: center;
		}

		&>div:not(.header__items, .header__search) {
			padding: auto-clamp(12px, 24px) 0;
		}

		&.header__top {
			@media screen and (max-width: 856px) {
				display: none;
			}
		}

		&.container__bottom {
			&::before {
				content: '';
				display: block;
				height: 2px;
				width: 200%;
				background-color: $color-border;
				position: absolute;
				top: 0;
				left: -50%;
			}

			&::after {
				content: '';
				display: block;
				height: 2px;
				width: 200%;
				background-color: $color-border;
				position: absolute;
				bottom: 0;
				left: -50%;
			}

			align-items: stretch;
		}
	}

	.header__phone {
		font-size: auto-clamp(16px, 26px);

		span:not(.nuxt-icon) {
			transition: $transition;
		}

		&:hover {
			color: $color-accent;
		}
	}

	.header__contacts {
		display: flex;
		gap: auto-clamp(15px, 30px);
		margin-right: 30px;
	}

	.header__items {
		display: flex;
		font-size: auto-clamp(16px, 20px);
		margin-right: 20px;

		&.header__items-mobile {
			display: none;

			a {
				padding: 10px;
				font-size: 20px;
				border: none !important;

				.nuxt-icon {
					font-size: 20px;
				}
			}

			.header__favorites-count,
			.header__cart-count {
				width: 16px;
				height: 16px;
				font-size: 12px;
				left: 24px;
			}

			@media screen and (max-width: 856px) {
				display: flex;
			}
		}

		@media screen and (max-width: 1024px) {
			.header__lk {
				.header__email {
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					max-width: 80px;
				}

			}
		}


		&>a {
			display: flex;
			align-items: center;
			gap: auto-clamp(10px, 20px);
			padding: auto-clamp(16px, 24px) auto-clamp(30px, 60px);

			.short-text {
				display: none;

				@media screen and (max-width: 1024px) {
					display: block;
				}
			}

			.full-text {
				display: block;

				@media screen and (max-width: 1024px) {
					display: none;
				}
			}

			span:not(.nuxt-icon) {
				transition: $transition;
			}

			&:hover {
				color: $color-accent;
			}

			&:last-of-type {
				padding-right: 0;
			}

			.nuxt-icon {
				font-size: auto-clamp(16px, 32px);
			}

			&.header__cart {
				border-left: 2px solid $color-border;
				border-right: 2px solid $color-border;
			}
		}
	}

	.header__nav {
		@include flex(row, space-between, center);
		flex: 1;

		@media screen and (max-width: 856px) {
			display: none;
		}

		.header__catalog {
			@include flex(row, space-between, center);
			gap: auto-clamp(20px, 42px);
			border-left: 2px solid $color-border;
			border-right: 2px solid $color-border;
			height: 100%;
			padding: 0 auto-clamp(25px, 50px);
		}

		.header__menu {
			@include flex(row, space-between, center);
			width: 100%;
			gap: auto-clamp(18px, 20px);
			margin-bottom: 0;
			padding: 0 auto-clamp(16px, 70px);

			&-item {
				font-weight: 700;
				font-size: auto-clamp(14px, 20px);
				transition: $transition;

				&:hover {
					color: $color-accent;
				}
			}
		}
	}

	.header__nav-mobile {
		width: 100%;
		padding-top: 24px;

		.header__menu-item {
			a {
				@include flex(row, space-between, center);
				font-size: 28px;
				font-weight: 700;
				width: 100%;
				border-bottom: 2px solid $color-border;
				padding-bottom: 18px;
				margin-bottom: 18px;
			}

			.nuxt-icon {
				font-size: 18px;
				color: $color-accent;
			}

			&:hover {
				.nuxt-icon {
					transform: translate(5px, -5px);
				}
			}
		}
	}

	.burger {
		width: 36px;
		height: 60px;
		position: relative;

		&.burger_mobile {
			display: none;

			@media screen and (max-width: 856px) {
				display: block;
			}
		}

		.icon-left {
			transition-duration: 0.5s;
			position: absolute;
			height: 2px;
			width: 15px;
			top: 30px;
			background-color: $color-gray;

			&:before {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: '';
				top: -10px;
			}

			&:after {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: '';
				top: 10px;
			}

			&:hover {
				cursor: pointer;
			}
		}

		.icon-right {
			transition-duration: 0.5s;
			position: absolute;
			height: 2px;
			width: 15px;
			top: 30px;
			background-color: $color-gray;
			left: 15px;

			&:before {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: '';
				top: -10px;
			}

			&:after {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: '';
				top: 10px;
			}
		}

		&.open {
			.icon-left {
				transition-duration: 0.5s;
				background: transparent;

				&:before {
					transform: rotateZ(45deg) scaleX(1.4) translate(2px, 2px);
				}

				&:after {
					transform: rotateZ(-45deg) scaleX(1.4) translate(2px, -2px);
				}
			}

			.icon-right {
				transition-duration: 0.5s;
				background: transparent;

				&:before {
					transform: rotateZ(-45deg) scaleX(1.4) translate(-2px, 2px);
				}

				&:after {
					transform: rotateZ(45deg) scaleX(1.4) translate(-2px, -2px);
				}
			}
		}

		&:hover {
			cursor: pointer;
		}
	}

	.header__search {
		@include flex(row, space-between, center);
		font-size: auto-clamp(20px, 32px);
		color: $color-gray;
		padding: 0 auto-clamp(16px, 42px);
		border-left: 2px solid $color-border;

		@media screen and (max-width: 856px) {
			display: none;
		}
	}
}

.menu {
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	background: white;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	z-index: 100;
	background-color: $color-white;
	transition: $transition;
	padding: 24px 0 90px;
	overflow-x: hidden;
	overflow-y: auto;


	.menu__brands {
		&-title {
			font-size: auto-clamp(28px, 44px);
			margin-bottom: auto-clamp(20px, 24px);
			color: $color-accent;
			font-weight: bold;
		}

		.link {
			font-size: auto-clamp(24px, 32px);
			color: $color-primary;
			margin-bottom: 12px;
			display: inline-block;
			font-weight: bold;
		}
	}

	&.menu-mobile {
		height: calc(100svh - 60px);
	}

	.menu__container {
		align-items: flex-start;
		flex-direction: column;

		.links {
			@include flex(row, flex-start, center);
			gap: 40px;
			flex-wrap: wrap;

			.link {
				font-size: 22px;
				color: $color-primary;
			}


		}

		.header__link {
			font-size: 22px;
			color: $color-primary;
			margin-top: 12px;
		}
	}

	.menu__column {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 10px;

		.menu__column-title {
			font-size: auto-clamp(20px, 32px);
			margin-bottom: auto-clamp(26px, 42px);
		}

		.menu__item {
			font-size: auto-clamp(14px, 20px);
			color: $color-gray;
		}
	}

	.menu__stocks {
		@include flex(column, center, flex-start);
		gap: 8px;


		&-item {
			@include flex(column, space-between, flex-start);
			width: auto-clamp(300px, 400px);
			height: auto-clamp(140px, 164px);
			padding: 22px;
			position: relative;
			background-size: cover;
			background-position: top;
			background-repeat: no-repeat;
			overflow: hidden;
			color: $color-white;
		}

		.stocks__item-date {
			@include flex(row, center, center);
			padding: 12px 22px;
			font-size: auto-clamp(12px, 20px);
			background-color: $color-red;
			width: fit-content;
			font-weight: 700;
		}

		.h3 {
			font-size: auto-clamp(16px, 24px);
			width: fit-content;
			padding-top: 24px;
		}
	}
}
</style>
