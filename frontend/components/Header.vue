<script lang="ts" setup>
import { NuxtLink } from '#components'
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
					<NuxtIcon name="favorites" />
					<span class="header__favorites-count">0</span>
				</NuxtLink>

				<NuxtLink to="#" class="header__cart">
					<NuxtIcon name="cart" />
					<span>Корзина</span>
				</NuxtLink>

				<NuxtLink to="#" class="header__lk">
					<NuxtIcon name="lk" />
					<span>Личный кабинет</span>
				</NuxtLink>
			</div>
		</div>
		<div class="container container__bottom">
			<div class="header__logo">
				<NuxtLink to="/">
					<NuxtImg src="../public/images/logo.svg" alt="logo" width="260" />
				</NuxtLink>
			</div>

			<nav class="header__nav">
				<div class="header__catalog">
					<div class="burger burger_catalog">
						<span></span>
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
						<NuxtLink to="/catalog"><span>Компания</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/catalog"><span>Партнёрам</span></NuxtLink>
					</li>
					<li class="header__menu-item">
						<NuxtLink to="/catalog"><span>Контакты</span></NuxtLink>
					</li>
				</ul>
			</nav>

			<div class="header__search">
				<NuxtLink to="/catalog">
					<NuxtIcon name="search" />
				</NuxtLink>
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>
.header {
	overflow: hidden;

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&>div:not(.header__items, .header__search) {
			padding: 24px 0;
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
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: auto-clamp(24px, 32px);

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
	}

	.header__items {
		display: flex;
		font-size: 20px;

		&>a {
			display: flex;
			align-items: center;
			gap: 20px;
			padding: 24px 60px;

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
				font-size: 32px;
			}

			&.header__cart {
				border-left: 2px solid $color-border;
				border-right: 2px solid $color-border;
			}
		}
	}

	.header__nav {
		display: flex;
		align-items: center;

		.header__catalog {
			display: flex;
			align-items: center;
			gap: auto-clamp(26px, 42px);
			border-left: 2px solid $color-border;
			border-right: 2px solid $color-border;
			height: 100%;
			padding: 0 50px;
		}

		.header__menu {
			display: flex;
			gap: auto-clamp(16px, 70px);
			margin-bottom: 0;
			padding: 0 auto-clamp(16px, 70px);

			&-item {
				font-weight: 700;
				font-size: auto-clamp(16px, 20px);
				transition: $transition;

				&:hover {
					color: $color-accent;
				}
			}
		}
	}

	.burger {
		@include flex(column, center, center);
		gap: 6px;
		cursor: pointer;
		position: relative;
		height: 12px;

		span {
			display: block;
			width: 36px;
			height: 2px;
			background-color: $color-gray;

			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 2px;
				background-color: $color-gray;
				position: absolute;
				top: 0px;
			}

			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2px;
				background-color: $color-gray;
				position: absolute;
				bottom: 0px;
			}
		}
	}

	.header__search {
		display: flex;
		align-items: center;
		font-size: 32px;
		color: $color-gray;
		padding: 0 auto-clamp(16px, 42px);
		border-left: 2px solid $color-border;
	}
}
</style>
