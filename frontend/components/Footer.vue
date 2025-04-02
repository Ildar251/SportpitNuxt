<script setup lang="ts">
import { NuxtLink } from '#components'
import { useSiteSettings } from '~/composables/useSiteSettings'
const settings = useSiteSettings()
</script>

<template>
	<footer class="footer">
		<div class="container">
			<div class="footer__top">
				<NuxtImg src="/images/logo_light.svg" alt="logo" sizes="200px  md:260px" />

				<div class="footer__contacts">
					<a :href="settings.telegram" class="footer__link">telegram</a>
					<a :href="settings.whatsapp" class="footer__link">whatsapp</a>
					<a :href="settings.vk" class="footer__link">vk</a>
				</div>
			</div>

			<nav class="footer__nav">
				<div class="footer__column">
					<h3 class="h3">Каталог</h3>
					<ul class="footer__list">
						<li class="footer__list-item">
							<NuxtLink to="/">Спортивное питание</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Напитки</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Энергетики</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Батончики</NuxtLink>
						</li>
					</ul>
				</div>
				<div class="footer__column">
					<h3 class="h3">Инфо</h3>
					<ul class="footer__list">
						<li class="footer__list-item">
							<NuxtLink to="/">О нас</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Вакансии</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Способы доставки</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Новости</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Контакты</NuxtLink>
						</li>
					</ul>
				</div>
				<div class="footer__column">
					<h3 class="h3">Партнёрам</h3>
					<ul class="footer__list">
						<li class="footer__list-item">
							<NuxtLink to="/">Оптовым клиентам</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Поставщикам</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Спорстменам</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Блогерам</NuxtLink>
						</li>
						<li class="footer__list-item">
							<NuxtLink to="/">Амбассадорам</NuxtLink>
						</li>
					</ul>
				</div>
				<div class="footer__column">
					<a :href="'tel:' + settings.phone" class="footer__phone footer__link">{{ settings.phone }}</a>
					<a :href="'mailto:' + settings.email" class="footer__email footer__link">{{ settings.email }}</a>
				</div>
			</nav>

			<div class="footer__bottom">
				<div class="footer__bottom-left">
					<NuxtLink to="/privacy-policy" class="footer__link">Политика конфиденциальности</NuxtLink>
					<NuxtLink to="/sitemap" class="footer__link">Карта сайта</NuxtLink>
				</div>

				<NuxtLink to="https://topmarka1.ru/" target="_blank" class="footer__info">
					<NuxtImg src="/images/topmarka.svg" alt="topmarka" />
					<span>Создание сайта</span>
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
.footer {
	padding: auto-clamp(40px, 72px) 0;
	background-color: $color-primary;
	color: $color-white;

	.footer__top {
		@include flex(row, space-between, center);

		@media screen and (max-width: 768px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 40px;
		}
	}

	.footer__bottom {
		@include flex(row, space-between, center);
		border-top: 2px solid $color-border;
		padding-top: 26px;
		color: $color-gray;

		@media screen and (max-width: 768px) {
			flex-direction: column;
			gap: 20px;
			align-items: flex-start;
			border-top: 0px solid $color-border;
		}

		.footer__bottom-left {
			@include flex(row, space-between, center);
			gap: 24px;

			@media screen and (max-width: 768px) {
				flex-direction: column;
				gap: 20px;
				align-items: flex-start;
			}
		}
	}

	.footer__nav {
		border-top: 2px solid $color-border;
		margin-top: auto-clamp(60px, 120px);
		@include flex(row, space-between, flex-start);
		flex-wrap: wrap;

		@media screen and (max-width: 768px) {
			border-top: 0 solid $color-border;
			gap: 20px;
		}

		.footer__column {
			@include flex(column, flex-start, flex-start);
			gap: 6px;
			padding: auto-clamp(22px, 42px);
			position: relative;

			@media screen and (max-width: 768px) {
				padding: 0;
			}

			.footer__link {
				font-size: auto-clamp(22px, 32px);
			}

			&:not(:first-child)::before {
				content: '';
				display: block;
				width: 2px;
				height: 100%;
				max-height: 150px;
				background-color: $color-border;
				position: absolute;
				top: 0;
				left: 0;

				@media screen and (max-width: 768px) {
					display: none;
				}
			}

			.h3 {
				font-size: auto-clamp(22px, 38px);
				font-weight: 700;
				margin-bottom: auto-clamp(24px, 42px);
			}

			.footer__list {
				@include flex(column, flex-start, flex-start);
				gap: auto-clamp(12px, 24px);

				.footer__list-item {
					font-size: auto-clamp(16px, 22px);
					color: $color-gray;
				}
			}
		}
	}

	.footer__contacts {
		display: flex;
		flex-wrap: wrap;
		gap: auto-clamp(20px, 40px);

		.footer__link {
			font-size: auto-clamp(22px, 38px);
			position: relative;

			&::after {
				content: '';
				display: block;
				width: 13px;
				height: 13px;
				background-image: url('/images/link-arrow.svg');
				background-size: cover;
				position: absolute;
				right: calc(auto-clamp(15px, 10px) * -1);
				top: calc(auto-clamp(10px, 3px) * -1);
				transition: $transition;
			}

			&:hover {
				&::after {
					transform: translate(3px, -3px);
				}
			}
		}
	}

	.footer__info {
		@include flex(column, flex-start, flex-start);
		gap: 8px;
		font-size: 10px;
	}
}
</style>
