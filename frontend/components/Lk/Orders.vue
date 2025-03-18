<script setup lang="ts">
const config = useRuntimeConfig()
interface Order {
	order_id: string
	items: Array<{
		id: number
		title: string
		price: number | string
		image: string
		volume: number | string
		quantity: number
	}>
	total_price: number
	payment_method: string
	delivery_method: string
	created_at: string
	status: string
}

const props = defineProps<{
	orders: Order[]
	isLoading: boolean
}>()

const expandedOrder = ref<string | null>(null)

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	const hour = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	return `${day}/${month}/${year} ${hour}:${minutes}`
}

const emit = defineEmits(['height-changed'])

const toggleOrderDetails = async (orderId: string) => {
	expandedOrder.value = expandedOrder.value === orderId ? null : orderId
	await nextTick() // Ждем обновления DOM
	emit('height-changed') // Отправляем событие родителю
}
</script>

<template>
	<div v-if="isLoading" class="loading">Загрузка...</div>
	<div v-else-if="orders.length === 0" class="no-orders">
		У вас пока нет заказов
	</div>
	<div v-else class="orders-list">
		<div
			v-for="order in orders"
			:key="order.order_id"
			:class="
				'order-item' + (expandedOrder === order.order_id ? ' expanded' : '')
			"
		>
			<div class="row">
				<div class="left">
					<div class="order-item__date">
						{{ formatDate(order.created_at) }}
					</div>
					<div><span>Статус:</span> {{ order.status }}</div>
					<h3 class="order-item__id">Заказ №{{ order.order_id }}</h3>
				</div>
				<div class="right">
					<div class="order-item__price">{{ order.total_price }} ₽</div>

					<div
						class="btn btn-more btn-more-order"
						@click="toggleOrderDetails(order.order_id)"
					>
						<Transition name="slide-down">
							<span v-if="expandedOrder !== order.order_id">Подробнее</span>
							<span v-else>Скрыть</span>
						</Transition>
						<NuxtIcon name="arrow-bottom" />
					</div>
				</div>
			</div>
			<Transition name="slide-up">
				<div class="more" v-if="expandedOrder === order.order_id">
					<div class="order-items">
						<div v-for="item in order.items" :key="item.id" class="item">
							<div class="item-wrap">
								<NuxtImg
									:src="
										item.image
											? `${config.public.apiUrl}${item.image}`
											: '/placeholder.png'
									"
									:alt="item.title || 'Товар'"
									class="item-image"
									height="120"
								/>
								<div class="item-quantity">
									{{ item.quantity }}
								</div>
							</div>
							<div class="item-info">
								<span>{{ item.title || 'Без названия' }}</span>
							</div>
						</div>
					</div>

					<div class="more__bottom row">
						<div class="more__bottom-info">
							<span>Способ оплаты:</span> {{ order.payment_method }}
						</div>
						<div class="more__bottom-info">
							<span>Доставка:</span> {{ order.delivery_method }}
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.orders-list {
	@include flex(column, flex-start, flex-start);
	gap: 24px;

	.order-item {
		background-color: #fcfcfc;
		width: 100%;
		padding: 32px;
		color: $color-gray;
		transition: $transition;

		.row {
			@include flex(row, space-between, stretch);
		}

		.right {
			@include flex(column, space-between, flex-end);
			height: auto;
		}

		.order-item__id {
			color: $color-primary;
			font-size: auto-clamp(20px, 32px);
			margin-top: auto-clamp(24px, 42px);
		}

		.order-item__date {
			margin-bottom: 24px;
			font-size: auto-clamp(18px, 24px);
		}

		.order-item__price {
			font-weight: 700;
			font-size: auto-clamp(24px, 42px);
		}

		.btn-more {
			color: $color-primary;
			position: relative;
			font-size: auto-clamp(18px, 24px);

			.nuxt-icon {
				font-size: auto-clamp(14px, 18px);
			}

			span:not(.nuxt-icon) {
				display: flex;
				position: absolute;
				right: 0;
				&::after {
					content: '';
					display: block;
					width: 40px;
					height: 40px;
				}
			}

			&:hover {
				color: $color-accent;

				.nuxt-icon {
					transform: translate(3px, 3px);
				}
			}
		}

		&.expanded {
			background-color: $color-light;
			color: $color-primary;
			.btn-more {
				.nuxt-icon {
					transform: rotate(-170deg);
				}
			}
		}

		.more {
			margin-top: 32px;
			padding-top: 32px;
			border-top: 2px solid $color-border;

			&__bottom {
				margin-top: 32px;
				&-info {
					@include flex(column, space-between, flex-start);
					font-size: auto-clamp(18px, 24px);
					font-weight: 700;

					span {
						font-size: 14px;
					}
				}
			}
		}

		.order-items {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(116px, 116px));
			gap: 20px;
		}

		.item {
			width: 100%;

			.item-wrap {
				@include flex(column, center, center);
				aspect-ratio: 1 / 1;
				object-fit: contain;
				object-position: center 30px;
				background-color: $color-light;
				margin-bottom: 12px;
				position: relative;

				.item-image {
					object-fit: contain;
					object-position: center 30px;
					height: 100%;
				}
			}

			.item-quantity {
				font-size: 14px;
				font-weight: 700;
				color: $color-gray;
				border-radius: 50%;
				background-color: $color-accent;
				position: absolute;
				width: 32px;
				height: 32px;
				@include flex(row, center, center);
				top: 12px;
				right: -16px;
				color: $color-white;
				font-size: 24px;
				line-height: 1;
			}

			.item-info {
				font-size: 14px;
				font-weight: 700;
				color: $color-gray;
			}
		}
	}
}
</style>
