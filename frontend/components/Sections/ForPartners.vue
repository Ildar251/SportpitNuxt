<script setup lang="ts">
const props = defineProps<{ data?: any, page?: any }>()

const for_partners = computed(() => {
	try {
		return props.page?.tvFields?.for_partners
			? JSON.parse(props.page?.tvFields?.for_partners)
			: []
	} catch (error) {
		console.error('❌ Ошибка парсинга MIGX-поля advantages_items:', error)
		return []
	}
})

console.log(for_partners.value[0].tab)

const tabs = computed(() => {
	return for_partners.value.map((item: { tab: string }) => ({
		id: item.tab,
		label: item.tab,
	}))
})

const activeTab = ref(tabs.value[0].id)

</script>

<template>
	<section class="section section-for-partners" id="partners">
		<div class="container ">
			<div class="partners">
				<div class="left">
					<UiTabs tabsClass="tabs-for-partners" v-model="activeTab" :tabs="tabs" />
				</div>

				<div class="content" v-for="item in for_partners" :key="item.MIGX_id">
					<div v-if="item.tab === activeTab" v-html="item.content"></div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.partners {
	display: grid;
	grid-template-columns: 420px 1fr;
	border-top: 2px solid $color-border;
	gap: 96px;

	.left {
		padding-top: 40px;
		position: relative;

		&::before {
			content: '';
			display: block;
			width: 2px;
			height: 100%;
			max-height: 300px;
			background-color: $color-border;
			position: absolute;
			top: 0;
			right: -42px;
		}
	}

	.tabs-for-partners {
		flex-direction: column;
	}
}
</style>
