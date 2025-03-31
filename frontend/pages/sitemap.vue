<script setup lang="ts">
import { usePage } from '~/composables/usePage'

// Используем usePage для загрузки данных страницы (если они есть в API)
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } =
	usePage('sitemap')

// Устанавливаем мета-теги для SEO
useHead({
	title: pageTitle,
	meta: [
		{ name: 'description', content: pageDescription },
		{ property: 'og:title', content: pageTitle },
		{ property: 'og:description', content: pageDescription },
		{ property: 'og:type', content: 'website' },
	],
	link: [{ rel: 'canonical', href: `https://test.top-nnov.ru/sitemap` }],
})

// Список ссылок для карты сайта
const siteLinks = [
	{ title: 'Главная', path: '/' },
	{ title: 'Каталог', path: '/catalog' },
	{ title: 'Акции', path: '/stocks' },
	{ title: 'О компании', path: '/about' },
	{ title: 'Партнёрам', path: '/partners' },
	{ title: 'CTM', path: '/catalog' }, // Можно уточнить путь
	{ title: 'Контакты', path: '/contacts' },
	{ title: 'Личный кабинет', path: '/lk' },
	{ title: 'Политика конфиденциальности', path: '/privacy-policy' },
	{ title: 'Карта сайта', path: '/sitemap' },
]
</script>

<template>
	<main class="sitemap">
		<component
			v-for="section in sections"
			:is="sectionMap[section]"
			:key="section"
			:data="sectionsData[section]"
			:page="page"
		/>

		<section class="section section-sitemap">
			<div class="container">
				<p>
					Ниже представлен список всех основных разделов нашего сайта для
					удобной навигации.
				</p>
				<ul class="sitemap__list">
					<li v-for="link in siteLinks" :key="link.path" class="sitemap__item">
						<NuxtLink :to="link.path" class="sitemap__link">{{
							link.title
						}}</NuxtLink>
					</li>
				</ul>
			</div>
		</section>
	</main>
</template>

<style scoped lang="scss">
.section-sitemap h1 {
	margin-bottom: 2rem;
}

.section-sitemap p {
	margin-bottom: 1rem;
	line-height: 1.6;
}

.sitemap__list {
	list-style: none;
	padding: 0;
}

.sitemap__item {
	margin-bottom: 0.5rem;
}

.sitemap__link {
	color: $color-primary;
	text-decoration: none;
	font-size: 1.1rem;
}

.sitemap__link:hover {
	text-decoration: underline;
}
</style>
