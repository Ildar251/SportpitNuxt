<script setup lang="ts">
const props = defineProps<{ page?: any }>()
const config = useRuntimeConfig()
const text_block = computed(() => {
	try {
		return props.page.tvFields?.text_block
			? JSON.parse(props.page.tvFields?.text_block)
			: []
	} catch (error) {
		console.error('❌ Ошибка парсинга MIGX-поля :', error)
		return []
	}
})
</script>

<template>
	<section class="section section-text">
		<div class="container">
			<div
				:class="'text-block' + (item.MIGX_id % 2 === 0 ? ' reverse' : '')"
				v-for="item in text_block"
				:key="item.MIGX_id"
			>
				<div class="column">
					<h2 class="h2" v-if="item.title">{{ item.title }}</h2>
					<div class="text" v-html="item.text"></div>
				</div>

				<div class="image">
					<NuxtImg :src="config.public.apiUrl + item.img" :alt="item.title" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.text-block {
	display: flex;
	gap: auto-clamp(34px, 72px);
	margin-top: auto-clamp(30px, 72px);

	&.reverse {
		flex-direction: row-reverse;
	}

	.column {
		flex: 3;
	}

	.image {
		flex: 2;

		img {
			width: 100%;
			object-fit: contain;
		}
	}
}

.h2 {
	margin-bottom: auto-clamp(24px, 42px);
	font-size: auto-clamp(24px, 50px);
}

.text {
	color: $color-gray;
	line-height: 1.4;
	font-size: auto-clamp(14px, 16px);
}
</style>
