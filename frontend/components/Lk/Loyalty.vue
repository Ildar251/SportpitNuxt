<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Проверяем, что пользователь — физическое лицо
const isEligibleForLoyalty = computed(() => {
	return authStore.user && !authStore.user.isLegalEntity
})
</script>

<template>
	<div v-if="isEligibleForLoyalty" class="loyalty-program">
		<div class="loyalty-program__item">
			<div>
				<strong>{{ authStore.user?.loyaltyPoints }}</strong>
				<span>Баллов</span>
			</div>
			<p>Можете оплатить ими часть заказа</p>
		</div>
		<div class="loyalty-program__info">
			<div>
				<strong>1%</strong>
			</div>
			<p>С ваших всех покупок будет зачислен в бонусную программу</p>
		</div>
	</div>
	<div v-else class="loyalty-program">
		<p>Программа лояльности доступна только для физических лиц.</p>
	</div>
</template>

<style scoped lang="scss">
.loyalty-program {
	@include flex(row, flex-start, flex-start);

	.loyalty-program__item {
		padding: 24px auto-clamp(30px, 42px);
		background-color: $color-accent;
		color: $color-white;
		width: fit-content;

		div {
			@include flex(column, flex-start, flex-start);

			strong {
				font-size: auto-clamp(48px, 72px);
				line-height: 1;
			}
		}

		p {
			max-width: 140px;
			padding-top: 18px;
		}
	}

	.loyalty-program__info {
		padding: 24px auto-clamp(30px, 42px);
		background-color: #fcfcfc;
		color: $color-primary;
		width: fit-content;

		div {
			@include flex(column, flex-start, flex-start);

			strong {
				font-size: auto-clamp(48px, 72px);
				line-height: 1;
			}
		}

		p {
			max-width: 190px;
			padding-top: 18px;
			text-wrap: balance;
			color: $color-gray;
		}
	}
}
</style>
