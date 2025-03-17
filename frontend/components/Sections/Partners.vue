<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
const props = defineProps<{
	data?: { partners_items?: string; partners_title?: string }
}>()
const config = useRuntimeConfig()

// Парсим JSON, если поле существует
const partners = computed(() => {
	try {
		console.log(props.data?.partners_items)

		return props.data?.partners_items
			? JSON.parse(props.data.partners_items)
			: []
	} catch (error) {
		console.error('❌ Ошибка парсинга MIGX-поля partners_items:', error)
		return []
	}
})
console.log(partners)
</script>

<template>
	<section class="section section-partners" v-if="partners.length">
		<div class="container line-top">
			<div class="section__header">
				<h2 class="h2">{{ data?.partners_title || 'Партнеры' }}</h2>

				<NuxtLink to="/catalog" class="btn btn-more">
					<span>Смотреть все</span>
					<NuxtIcon name="arrow-right" />
				</NuxtLink>
			</div>
		</div>

		<div class="container partners">
			<Swiper
				:modules="[Pagination, Autoplay]"
				:breakpoints="{
					512: { slidesPerView: 2 },
					768: { slidesPerView: 3 },
					1440: { slidesPerView: 4 },
				}"
				:spaceBetween="20"
				:slidesPerView="1.4"
				:pagination="{ clickable: true }"
				:autoplay="{ delay: 2500, disableOnInteraction: false }"
				:speed="1000"
				class="partners-slider"
			>
				<SwiperSlide v-for="item in partners" :key="item.MIGX_id">
					<div class="partners__item">
						<h3 class="h3 partners__title">{{ item.title }}</h3>
						<div class="partners__logo">
							<NuxtImg
								:src="config.public.apiUrl + item.logo"
								:alt="item.title"
							/>
						</div>
						<div class="text">{{ item.text }}</div>
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.partners {
	margin-top: 42px;

	.swiper {
		overflow: visible !important;
	}

	.partners__item {
		@include flex(column, flex-start, flex-start);
		padding: 20px;
		background-color: $color-light;
		transition: $transition;
		width: 100%;

		&:hover {
			background-color: $color-primary;
			color: $color-white;

			.partners__title {
				color: $color-white;
			}

			.partners__logo {
				filter: brightness(0) invert(1);
			}
		}

		.partners__title {
			font-size: 24px;
			font-weight: 700;
			color: $color-primary;
			border-bottom: 2px solid $color-border;
			width: 100%;
			padding-bottom: 20px;
			margin-bottom: 20px;
		}

		.partners__logo {
			margin-top: auto;
			text-align: center;
			margin: 0 auto;

			@media screen and (max-width: 768px) {
				max-width: 50%;
			}
		}

		.text {
			text-align: center;
			margin: 0 auto;
			margin-top: 24px;
			font-size: 16px;
			color: $color-gray;
		}
	}
}
</style>
