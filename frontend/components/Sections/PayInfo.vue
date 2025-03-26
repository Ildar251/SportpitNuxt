<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, ref } from 'vue'

const config = useRuntimeConfig()

const props = defineProps<{ data?: any, page?: any }>()

const info = computed(() => {
	try {
		return props.page?.tvFields?.info
			? JSON.parse(props.page?.tvFields?.info)
			: []
	} catch (error) {
		console.error('❌ Ошибка парсинга MIGX-поля advantages_items:', error)
		return []
	}
})

console.log(info.value[0]?.tab)

const tabs = computed(() => {
	return info.value.map((item: { tab: string }) => ({
		id: item.tab,
		label: item.tab,
	}))
})

const activeTab = ref(tabs.value[0]?.id)

// Ref для экземпляра Swiper
const swiperRef = ref<SwiperType | null>(null)

// При изменении слайда обновляем activeTab
const onSlideChange = (swiper: SwiperType) => {
	const activeIndex = swiper.activeIndex
	activeTab.value = tabs.value[activeIndex]?.id
}

// Функция для переключения слайда при клике на таб
const setActiveTab = (tabId: string) => {
	const index = tabs.value.findIndex((tab: { id: string }) => tab.id === tabId)
	if (index !== -1 && swiperRef.value) {
		swiperRef.value.slideTo(index)
		activeTab.value = tabId
	}
}

</script>

<template>
	<section class="section section-pay-info">
		<div class="container">
			<div class="info">
				<div class="left">
					<UiTabs tabsClass="tabs-info" v-model="activeTab" :tabs="tabs" @update:model-value="setActiveTab" />
					<NuxtLink to="/pay-info" class="info__banner">
						<NuxtImg src="/images/banner_2.jpg" alt="info" />
						<div class="btn btn--fill">
							<span>Задать вопрос</span>
							<NuxtIcon name="arrow-right" />
						</div>
					</NuxtLink>
				</div>
				<Swiper :modules="[Pagination, Autoplay, EffectFade]" :spaceBetween="20" :slidesPerView="1"
					:pagination="{ clickable: true }" class="content-slider" :effect="'fade'"
					:fadeEffect="{ crossFade: true }" @swiper="(swiper) => (swiperRef = swiper)"
					@slideChange="onSlideChange" :speed="1000">
					<SwiperSlide v-for="item in info" :key="item.MIGX_id" class="content__item">
						<NuxtImg :src="config.public.apiUrl + item.img" :alt="item.tab" class="content__image"
							v-if="item.img" />
						<h2 class="h2">{{ item.tab }}</h2>
						<div class="content__text" v-html="item.content"></div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	</section>
</template>
<style lang="scss" scoped>
.info {
	display: grid;
	grid-template-columns: auto-clamp(250px, 400px) 1fr;
	border-top: 2px solid $color-border;
	gap: auto-clamp(40px, 96px);

	@media screen and (max-width: 768px) {
		grid-template-columns: 1fr;
	}

	.info__banner {
		position: relative;
		display: block;
		margin-top: 42px;
		background: linear-gradient(162.71deg, rgba(255, 152, 0, 0) 17.02%, #FF9800 103.11%), #EB4D40;

		@media screen and (max-width: 768px) {
			order: 1;
			@include flex(column, flex-end, flex-end);
		}

		&:hover {
			.btn {
				color: $color-accent;
				background-color: $color-white;
			}
		}

		img {
			display: flex;

			@media screen and (min-width: 768px) {
				width: 100%;
			}
		}

		.btn {
			position: absolute;
			margin: 0 24px;
			width: calc(100% - 48px);
			bottom: 24px;
			max-width: unset;
		}
	}

	.left {
		padding-top: 40px;
		position: relative;

		@media screen and (max-width: 768px) {
			display: contents;
		}



		&::before {
			content: '';
			display: block;
			width: 2px;
			height: 100%;
			max-height: 300px;
			background-color: $color-border;
			position: absolute;
			top: 0;
			right: calc(auto-clamp(20px, 40px) * -1);
		}
	}

	.content-slider {
		width: 100%;
		padding-top: auto-clamp(40px, 72px);

		.content__item {
			.content__image {
				float: left;
				margin: 0 40px 40px 0;
			}

			.h2 {
				margin: 0 0 24px;
				font-size: auto-clamp(32px, 50px);
			}

			.content__text {
				font-size: 16px;
				color: $color-gray;

				&>* {
					line-height: 1.4;
				}
			}
		}
	}




	.tabs-info {
		flex-direction: column;
	}
}
</style>
