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

				<div class="image" v-if="item.img">
					<NuxtImg :src="config.public.apiUrl + item.img" :alt="item.title" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
.h2 {
	margin-bottom: auto-clamp(24px, 42px);
	font-size: auto-clamp(24px, 50px);
}

.privacy-policy {
	padding: 2rem 0;

	.text {
		color: $color-primary;

		h2 {
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		p {
			margin-bottom: 1rem;
			line-height: 1.6;
		}

		a {
			text-decoration: underline;
		}
	}
}
.text {
	color: $color-gray;
	line-height: 1.4;
	font-size: auto-clamp(14px, 16px);
}
</style>
