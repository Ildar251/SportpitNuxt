<script lang="ts" setup>
import { useCartStore } from '@/stores/cartStore'
import { useFavoriteStore } from '@/stores/favoritesStore'

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

import type { Taste } from '@/types/product'

const props = defineProps<{
	product: {
		id: number
		title: string
		description: string
		content: string
		parent: number
		category: string | null
		alias: string
		price?: string // Изменено на string для соответствия API
		brand?: string
		taste?: Taste[]
		sticker?: string
		image?: string
		volume?: string
	}
}>()

const product = props.product

const config = useRuntimeConfig()
const isHovered = ref(false)

const stickers = computed(() => (product.sticker ? product.sticker.split('||') : []))
const volume = computed(() => (product.volume ? product.volume.split('||') : []))
const activeIndex = ref(0)

const onVolumeClick = (index: number) => {
	activeIndex.value = index
}

const addToCart = () => {
	cartStore.addToCart({
		id: product.id,
		title: product.title,
		price: product.price ? parseFloat(product.price) : 0, // Приводим строку к числу
		image: product.image,
		volume: volume.value[activeIndex.value] ? parseInt(volume.value[activeIndex.value]) : 0,
		quantity: 1,
	})
}

const toggleFavorite = () => {
	favoriteStore.toggleFavorite({
		id: product.id,
		title: product.title,
		price: product.price ? parseFloat(product.price) : 0, // Приводим строку к числу
		image: product.image,
		volume: volume.value[activeIndex.value] ? parseInt(volume.value[activeIndex.value]) : 0,
	})
	console.log(favoriteStore.isFavorite(product.id))
}
const firstTaste = computed(() => product.taste?.[0]?.taste || 'Без вкуса')
</script>

<template>
	<NuxtLink :to="'/products/' + product.alias" :class="'card' + (isHovered ? ' card--hover' : '')"
		@mouseover="isHovered = true" @mouseleave="isHovered = false">
		<div class="card__image">
			<Transition name="fade">
				<div class="card__sticker" v-if="stickers">
					<div v-for="sticker in stickers" :class="'card__sticker--item ' + sticker">
						<NuxtIcon name="new" v-if="sticker === 'new'" />
						<NuxtIcon name="hit" v-if="sticker === 'hit'" />
						<NuxtIcon name="hit" v-if="sticker === 'sale'" />
						<span>{{ sticker }}</span>
					</div>
				</div>
			</Transition>
			<Transition name="fade">
				<div :class="'card__favorite favorite' +
					(favoriteStore.isFavorite(product.id) ? ' favorite--active' : '')
					" @click.prevent.stop="toggleFavorite">
					<NuxtIcon name="favorites" />
				</div>
			</Transition>
			<NuxtImg :src="config.public.apiUrl + product.image" :alt="product.title" loading="lazy" class="card__img"
				placeholder="./images/box.svg" />
		</div>
		<div class="card__content">
			<div class="card__brand">{{ product.brand || 'Товар' }}</div>
			<h3 class="card__title">{{ product.title }}</h3>
			<div class="card__taste">{{ firstTaste }}</div>
			<span class="card__price">{{ product.price ? `${product.price} ₽` : 'Цена не указана' }}</span>
			<Transition name="fade">
				<div class="card__hovered" v-if="isHovered">
					<div class="card__volume">
						<div :class="'card__volume--item' +
							(index === activeIndex ? ' card__volume--active' : '')
							" v-for="(volume, index) in volume" :key="index" @click="onVolumeClick(index)">
							{{ volume }} мл
						</div>
					</div>
					<div class="button-wrapper">
						<Transition name="slide-up">
							<button v-if="!cartStore.isInCart(product.id)" class="btn add-to-cart"
								@click.prevent.stop="addToCart">
								<span class="span-text">В корзину</span>
								<NuxtIcon name="plus" />
							</button>

							<button v-else class="btn delete-from-cart"
								@click.prevent.stop="cartStore.removeFromCart(product.id)">
								<NuxtIcon name="delete" />
							</button>
						</Transition>
					</div>


				</div>
			</Transition>
		</div>
	</NuxtLink>
</template>

<style lang="scss" scoped>
.button-wrapper {
	display: block;
	position: relative;
	width: 100%;
	height: 85px;
	margin-top: auto;

	.btn {
		position: absolute;
		top: 0;
		margin-top: 0;
	}
}



.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.25s ease-out;
}

.slide-up-enter-from {
	opacity: 0;
	transform: translateY(30px);
}

.slide-up-leave-to {
	opacity: 0;
	transform: translateY(-30px);
}

.card {
	@include flex(column, center, center);
	gap: 25px;
	padding: 20px;
	position: relative;
	transition: $transition;
	z-index: 1;

	&--hover {
		background-color: $color-light;
		z-index: 2;
	}

	.card__img {
		max-height: 100%;
	}

	.card__volume {
		@include flex(row, flex-start, center);
		gap: 8px;
		transition: $transition;
		margin-top: 12px;
		margin-bottom: 24px;

		&--item {
			background-color: $color-white;
			color: $color-primary;
			font-size: 14px;
			padding: 10px 12px;
			cursor: pointer;
			transition: $transition;

			&:hover {
				transform: translateY(-5px);
			}

			&.card__volume--active {
				background-color: $color-primary;
				color: $color-white;
			}
		}
	}

	.card__image {
		@include flex(column, flex-end, center);
		height: auto-clamp(260px, 320px);
	}



	.card__content {
		@include flex(column, flex-start, flex-start);
		width: 100%;
		position: relative;
	}

	.card__taste {
		color: $color-primary;
		font-size: 18px;
		margin-bottom: 12px;
	}

	.card__brand {
		color: $color-gray;
		font-size: 12px;
		border-bottom: 2px solid $color-light;
		width: 100%;
		padding-bottom: 12px;
		font-weight: 600;
	}

	.card__title {
		color: $color-primary;
		font-size: 18px;
		font-weight: 700;
		margin-top: 12px;
	}

	.card__price {
		color: $color-gray;
		font-size: 18px;
	}

	.card__hovered {
		position: absolute;
		background-color: $color-light;
		bottom: -190px;
		left: -20px;
		padding: 0 20px 20px;
		width: calc(100% + 40px);
	}

	.card__favorite {
		position: absolute;
		right: 20px;
		top: 20px;
	}
}
</style>
