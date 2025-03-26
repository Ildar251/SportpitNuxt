<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, page } = usePage('delivery-and-payment')
</script>

<template>
	<main class="main-about">
		<component v-for="section in sections" :page="page" :is="sectionMap[section]" :key="section"
			:data="sectionsData[section]" />
	</main>
</template>

<style lang="scss" scoped></style>
