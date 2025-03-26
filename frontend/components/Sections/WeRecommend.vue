<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

const props = defineProps<{ data?: { recommended_title?: string; recommended_items?: string } }>()
const config = useRuntimeConfig()

// Парсим JSON, если поле существует
const recommended = computed(() => {
	try {
		return props.data?.recommended_items
			? JSON.parse(props.data.recommended_items)
			: []
	} catch (error) {
		console.error('❌ Ошибка парсинга MIGX-поля recommended_items:', error)
		return []
	}
})
</script>

<template>
	<section class="section section-recommended">
		<div class="container line-top">
			<div class="section__header">
				<h2 class="h2">{{ data?.recommended_title || 'Мы рекомендуем' }}</h2>
			</div>
		</div>

		<div class="container recommended">
			<Swiper :modules="[Pagination, Autoplay]" :breakpoints="{
				512: { slidesPerView: 2 },
				768: { slidesPerView: 3 },
				1440: { slidesPerView: 4 },
			}" :spaceBetween="20" :slidesPerView="1.4" :pagination="{ clickable: true }"
				:autoplay="{ delay: 2500, disableOnInteraction: false }" :speed="1000" class="recommended-slider">
				<SwiperSlide v-for="item in recommended" :key="item.id">
					<NuxtLink :to="`${item.alias}`" class="recommended__item">
						<h3 class="h3 recommended__title">{{ item.title }}</h3>
						<div class="recommended__content">{{ item.content }}</div>
						<div class="recommended__logo">
							<NuxtImg :src="config.public.apiUrl + item.img" :alt="item.title" />
						</div>
					</NuxtLink>
				</SwiperSlide>
			</Swiper>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.recommended {
	margin-top: 42px;

	.swiper {
		overflow: visible !important;
	}

	.recommended__item {
		@include flex(column, flex-start, flex-start);
		padding: 20px;
		aspect-ratio: 1 / 1;
		background-color: $color-light;
		transition: $transition;

		&:hover {
			background-color: $color-primary;
			color: $color-white;

			.recommended__title {
				color: $color-white;
			}

			.recommended__logo {
				filter: brightness(0) invert(1);
			}
		}

		.recommended__title {
			font-size: 24px;
			font-weight: 700;
			color: $color-primary;
			border-bottom: 2px solid $color-border;
			width: 100%;
			padding-bottom: 20px;
			margin-bottom: 20px;
		}

		.recommended__logo {
			margin-top: auto;

			@media screen and (max-width: 768px) {
				max-width: 50%;
			}
		}
	}
}
</style>
