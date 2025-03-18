<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApiStore } from '~/stores/api'

const route = useRoute()
const apiStore = useApiStore()
const config = useRuntimeConfig()

// Получаем alias из маршрута
const alias = route.params.alias as string

// Проверяем, есть ли акция в сторе, если нет — загружаем все акции
const stock = computed(() => apiStore.getStockByAlias(alias))

onMounted(async () => {
	if (!stock.value && !apiStore.stocks.length) {
		await apiStore.fetchStocks()
	}
})
</script>

<template>
	<main>
		<section>
			<div class="container">
				<h1 class="h1 page-title">{{ stock?.title }}</h1>
			</div>

			<div class="container breadcrumbs">
				<NuxtLink to="/" class="breadcrumbs__item">Главная страница</NuxtLink>
				<NuxtLink to="/stocks" class="breadcrumbs__item">Акции</NuxtLink>
				<div class="breadcrumbs__item">{{ stock?.title }}</div>
			</div>
		</section>
		<section class="section section-stocks">
			<div class="container">
				<div class="stock" v-if="stock">
					<div class="stock__content">
						<div class="stock__date">{{ stock.tvFields.stock_date }}</div>
						<div
							class="stock__text text-block"
							v-html="stock.tvFields.stock_text"
						></div>
					</div>

					<NuxtImg
						:src="config.public.apiUrl + stock.tvFields.stock_image"
						:alt="stock.title"
						class="stock__image"
					/>
				</div>
				<div v-else-if="apiStore.loading" class="loading">Загрузка...</div>
				<div v-else class="not-found">Акция не найдена</div>
			</div>
		</section>
		<SectionsCapture />
	</main>
</template>

<style lang="scss" scoped>
.stock {
	@include flex(row, center, flex-start);
	gap: auto-clamp(32px, 64px);
	margin-top: 100px;
	padding-top: 42px;
	border-top: 2px solid $color-border;

	.stock__date {
		@include flex(row, center, center);
		padding: 16px 42px;
		font-size: auto-clamp(24px, 42px);
		background-color: $color-red;
		width: fit-content;
		font-weight: 700;
		color: $color-white;
		margin-bottom: 42px;
	}

	.stock__text {
		color: $color-gray;
	}
}
</style>
