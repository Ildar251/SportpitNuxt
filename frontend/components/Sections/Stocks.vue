<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
defineProps<{ data?: { stocks_title?: string } }>()

const config = useRuntimeConfig()

const apiStore = useApiStore()

onMounted(() => {
	apiStore.fetchStocks()
})

const stocks = computed(() => apiStore.stocks)
</script>

<template>
	<section class="section section-stocks">
		<div class="container stocks">
			<NuxtLink
				:to="`${stock.alias}`"
				class="stocks__item"
				v-for="stock in stocks"
				:key="stock.id"
				:style="{
					backgroundImage: `url(${
						config.public.apiUrl + stock.tvFields.stock_image
					})`,
				}"
			>
				<div class="stocks__item-date">{{ stock.tvFields.stock_date }}</div>
				<h3 class="h3">{{ stock.title }}</h3>
			</NuxtLink>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.stocks {
	margin-top: 42px;
	display: grid;
	grid-template-columns: repeat(2, minmax(300px, 1fr));
	gap: 24px;

	&__item {
		@include flex(column, space-between, flex-start);
		height: 300px;
		padding: 42px;
		position: relative;
		background-size: cover;
		background-position: top;
		background-repeat: no-repeat;
		overflow: hidden;
		color: $color-white;

		.stocks__item-date {
			@include flex(row, center, center);
			padding: 16px 42px;
			font-size: auto-clamp(12px, 24px);
			background-color: $color-red;
			width: fit-content;
			font-weight: 700;
		}

		.h3 {
			font-size: auto-clamp(24px, 32px);
			width: fit-content;
			border-top: 2px solid currentColor;
			padding-top: 24px;
		}
	}
}
</style>
