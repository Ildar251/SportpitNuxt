<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Card from '~/components/Card.vue'
import { useApiStore } from '~/stores/api'

const route = useRoute()
const apiStore = useApiStore()

// Реф для экземпляра Swiper
const swiperRef = ref<SwiperType | null>(null)

// Загружаем продукты, если они ещё не загружены
onMounted(async () => {
	if (!apiStore.products.length) {
		await apiStore.fetchProducts()
	}
})

// Находим текущий продукт по alias
const currentProduct = computed(() => {
	return apiStore.products.find(p => p.alias === route.params.alias) || null
})

// Фильтруем продукты той же категории, исключая текущий продукт
const relatedProducts = computed(() => {
	if (!currentProduct.value) return []
	return apiStore.products
		.filter(p =>
			p.category === currentProduct.value?.category &&
			p.alias !== currentProduct.value?.alias
		)
		.slice(0, 10)
})

// Обработчики для кастомных кнопок
const slidePrev = () => {
	if (swiperRef.value) {
		swiperRef.value.slidePrev()
	}
}

const slideNext = () => {
	if (swiperRef.value) {
		swiperRef.value.slideNext()
	}
}

// Устанавливаем референцию Swiper
const onSwiper = (swiper: SwiperType) => {
	swiperRef.value = swiper
}

console.log(relatedProducts.value)
</script>

<template>
	<section class="section section-mb" v-if="relatedProducts.length">
		<div class="container line-top">
			<div class="section__header">
				<h2 class="h2">Может понравиться</h2>
				<div class="slide-arrows">
					<NuxtIcon name="slide-left" class="button-prev" @click="slidePrev" />
					<NuxtIcon name="slide-right" class="button-next" @click="slideNext" />
				</div>
			</div>
		</div>
		<div class="container">
			<Swiper :modules="[Pagination, Navigation]" :slidesPerView="4" :spaceBetween="20"
				:pagination="{ clickable: true }" :breakpoints="{
					320: { slidesPerView: 1 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
					1440: { slidesPerView: 4 },
				}" class="mb-slider" @swiper="onSwiper">
				<SwiperSlide v-for="product in relatedProducts" :key="product.id">
					<Card :product="product" />
				</SwiperSlide>
			</Swiper>
		</div>
	</section>
</template>

<style scoped lang="scss">
.section-mb {
	padding: 40px 0;
}


.mb-slider {
	padding-bottom: 40px;
	margin-top: 42px;
}

.slide-arrows {
	@include flex(row, center, center);
	gap: 20px;

	.button-prev,
	.button-next {
		cursor: pointer;
		color: $color-gray;
		font-size: 24px;
	}
}
</style>