<script setup lang="ts">
import { motion } from "motion-v"
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
defineProps<{ data?: { brands_title?: string } }>()

const config = useRuntimeConfig()

const apiStore = useApiStore()

onMounted(() => {
	apiStore.fetchBrands()
})

const brands = computed(() => apiStore.brands)
</script>

<template>
	<section class="section section-brands">
		<div class="container line-top">
			<div class="section__header">
				<motion.div :initial="{ opacity: 0, x: -60, scale: 0.8 }" :whileInView="{ opacity: 1, x: 0, scale: 1 }"
					:transition="{ duration: 0.6, ease: 'easeOut', delay: 0.2 }"
					:viewport="{ once: true, margin: '0px 0px -100px 0px' }" :inViewOptions="{ once: true }">
					<h2 class="h2">{{ data?.brands_title || 'Бренды' }}</h2>
				</motion.div>


				<NuxtLink to="/catalog" class="btn btn-more">
					<span>Смотреть все</span>
					<NuxtIcon name="arrow-right" />
				</NuxtLink>
			</div>
		</div>

		<div class="container brands">
			<Swiper :modules="[Pagination, Autoplay]" :breakpoints="{
				512: { slidesPerView: 2 },
				768: { slidesPerView: 3 },
				1440: { slidesPerView: 4 },
			}" :spaceBetween="20" :slidesPerView="1.4" :pagination="{ clickable: true }"
				:autoplay="{ delay: 2500, disableOnInteraction: false }" :speed="1000" class="brands-slider">
				<SwiperSlide v-for="brand in brands" :key="brand.id">
					<motion.div :initial="{ opacity: 0, y: -60, scale: 0.8 }"
						:whileInView="{ opacity: 1, y: 0, scale: 1 }"
						:transition="{ duration: 0.6, ease: 'easeOut', delay: 0.2 }"
						:viewport="{ once: true, margin: '0px 0px -100px 0px' }" :inViewOptions="{ once: true }">
						<NuxtLink :to="`/brands/${brand.alias}`" class="brands__item">
							<h3 class="h3 brands__title">{{ brand.title }}</h3>
							<div class="brands__logo">
								<NuxtImg :src="config.public.apiUrl + brand.tvFields.info_logo" :alt="brand.title" />
							</div>
						</NuxtLink>
					</motion.div>

				</SwiperSlide>
			</Swiper>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.brands {
	margin-top: 42px;

	.swiper {
		overflow: visible !important;
	}

	.brands__item {
		@include flex(column, flex-start, flex-start);
		padding: 20px;
		aspect-ratio: 1 / 1;
		background-color: $color-light;
		transition: $transition;

		&:hover {
			background-color: $color-primary;
			color: $color-white;

			.brands__title {
				color: $color-white;
			}

			.brands__logo {
				filter: brightness(0) invert(1);
			}
		}

		.brands__title {
			font-size: 24px;
			font-weight: 700;
			color: $color-primary;
			border-bottom: 2px solid $color-border;
			width: 100%;
			padding-bottom: 20px;
			margin-bottom: 20px;
		}

		.brands__logo {
			margin-top: auto;

			@media screen and (max-width: 768px) {
				max-width: 50%;
			}
		}
	}
}
</style>
