<script lang="ts" setup>
import gsap from 'gsap'

import { NuxtLink } from '#components'
import { useAuthStore } from '~/stores/authStore'
import { useMenuStore } from '~/stores/useMenuStore'
import { useMobileMenuStore } from '~/stores/useMobileMenuStore'
import { useModalStore } from '~/stores/useModalStore'

const authStore = useAuthStore()
const modalStore = useModalStore()
const menuStore = useMenuStore()
const mobileMenuStore = useMobileMenuStore()

const logout = () => {
	authStore.logout()
}

watch(() => mobileMenuStore.isOpen, (isOpen) => {
	if (isOpen) {
		document.body.classList.add('no-scroll')
	} else {
		document.body.classList.remove('no-scroll')
	}
})

onMounted(() => {
	window.addEventListener("preloadComplete", () => {
		gsap.fromTo('.header',
			{ opacity: 0, y: -60 },
			{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
		)
	})
})
</script>
<template>
	<header class="header">
		<div class="container header__top">
			<div class="header__contacts">
				<a href="" class="header__link link">telegram</a>
				<a href="" class="header__link link">whatsapp</a>
				<a href="" class="header__link link">vk</a>
				<a href="mailto:info@nutrivery.ru" class="header__link link">info@nutrivery.ru</a>
			</div>

			<a href="tel:+7 945 998-99-65" class="header__phone">
				<NuxtIcon name="phone" />
				<span>+7 945 998-99-65</span>
			</a>

			<div class="header__items">
				<NuxtLink to="#" class="header__favorites">
					<NuxtIcon name="favorites-head" />
					<span class="header__favorites-count">0</span>
				</NuxtLink>

				<NuxtLink to="/lk?tab=cart" class="header__cart">
					<NuxtIcon name="cart" />
					<span>Корзина</span>
				</NuxtLink>

				<NuxtLink v-if="!authStore.apiToken" to="#" class="header__lk" @click.prevent="modalStore.open">
					<NuxtIcon name="lk" />
					<span class="full-text">Личный кабинет</span>
					<span class="short-text">ЛК</span>
				</NuxtLink>

				<NuxtLink v-else class="header__lk" to="/lk">
					<NuxtIcon name="lk" />
					<span class="header__email">{{ authStore.user?.email }}</span>
				</NuxtLink>
			</div>
		</div>
		<div class="container container__bottom">
			<div class="header__logo">
				<NuxtLink to="/">
					<NuxtImg src="/images/logo.svg" alt="logo" />
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
						<NuxtLink to="/catalog"><span>Бренды</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/catalog"><span>Акции</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/about"><span>Компания</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/catalog"><span>Партнёрам</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/catalog"><span>CTM</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/contacts"><span>Контакты</span></NuxtLink>
					</li>
				</ul>
			</nav>

			<div class="header__search">
				<NuxtLink to="/catalog">
					<NuxtIcon name="search" />
				</NuxtLink>
			</div>

			<div :class="'burger burger_mobile' + (mobileMenuStore.isOpen ? ' open' : '')"
				@click="mobileMenuStore.toggle">
				<div class="icon-left"></div>
				<div class="icon-right"></div>
			</div>
		</div>

		<Transition name="slide-down">
			<div class="menu" v-if="menuStore.isOpen">
				<div class="container menu__container">
					<div class="menu__column">
						<NuxtLink class="menu__column-title">Категория 1</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Бренды</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Акции</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Компания</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Партнёрам</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Контакты</NuxtLink>
					</div>
					<div class="menu__column">
						<NuxtLink class="menu__column-title">Категория 2</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Бренды</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Акции</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Компания</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Партнёрам</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Контакты</NuxtLink>
					</div>
					<div class="menu__column">
						<NuxtLink class="menu__column-title">Категория 3</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Бренды</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Акции</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Компания</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Партнёрам</NuxtLink>
						<NuxtLink to="/catalog" class="menu__item">Контакты</NuxtLink>
					</div>

					<div class="menu__stocks">
						<NuxtLink class="menu__stocks-item">
							<NuxtImg src="/images/stocks_1.jpg" alt="stocks" />
						</NuxtLink>

						<NuxtLink class="menu__stocks-item">
							<NuxtImg src="/images/stocks_2.jpg" alt="stocks" />
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
								<NuxtLink to="/catalog"><span>Бренды</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>

							</li>
							<li class="header__menu-item">
								<NuxtLink to="/catalog"><span>Акции</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/catalog"><span>Компания</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/catalog"><span>Партнёрам</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/catalog"><span>CTM</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
							<li class="header__menu-item">
								<NuxtLink to="/contacts"><span>Контакты</span>
									<NuxtIcon name="arrow-right" />
								</NuxtLink>
							</li>
						</ul>
					</nav>
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

	@media screen and (max-width: 768px) {
		top: 0;
	}

	.header__logo {
		width: auto-clamp(140px, 260px);
		margin-right: auto-clamp(20px, 40px);
		@include flex(row, flex-start, center);
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
			@media screen and (max-width: 768px) {
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

		@media screen and (max-width: 768px) {
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
				font-size: 32px;
				font-weight: 700;
				width: 100%;
				border-bottom: 2px solid $color-border;
				padding-bottom: 24px;
				margin-bottom: 24px;
			}

			.nuxt-icon {
				font-size: 21px;
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

			@media screen and (max-width: 768px) {
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
				content: "";
				top: -10px;
			}

			&:after {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: "";
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
				content: "";
				top: -10px;
			}

			&:after {
				transition-duration: 0.5s;
				position: absolute;
				width: 15px;
				height: 2px;
				background-color: $color-gray;
				content: "";
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

		@media screen and (max-width: 768px) {
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
	padding: 24px 0;

	&.menu-mobile {
		height: 100vh;
	}

	.menu__container {
		align-items: flex-start;
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
	}
}
</style>
