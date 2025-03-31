<script setup lang="ts">
import { usePage } from '~/composables/usePage'
const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } = usePage('about')
useHead({
	title: pageTitle,
	meta: [
		{ name: 'description', content: pageDescription },
		{ property: 'og:title', content: pageTitle },
		{ property: 'og:description', content: pageDescription },
		{ property: 'og:type', content: 'website' },
	],
})
</script>

<template>
	<main class="main-about">
		<component v-for="section in sections" :page="page" :is="sectionMap[section]" :key="section"
			:data="sectionsData[section]" :noInfoTitle="true" />
	</main>
</template>

<style lang="scss" scoped>
.breadcrumbs {
	margin-bottom: clamp(25px, 2.6041666667vw, 50px);
}
</style>
