<script setup lang="ts">
import { usePage } from '~/composables/usePage'

import { useSiteSettings } from '~/composables/useSiteSettings'
const settings = useSiteSettings()

const { sections, sectionMap, sectionsData, pageTitle, pageDescription, page } =
	usePage('privacy-policy')

useHead({
	title: pageTitle,
	meta: [
		{ name: 'description', content: pageDescription },
		{ property: 'og:title', content: pageTitle },
		{ property: 'og:description', content: pageDescription },
		{ property: 'og:type', content: 'website' },
	],
	link: [{ rel: 'canonical', href: `https://test.top-nnov.ru/privacy-policy` }],
})
</script>

<template>
	<main class="privacy-policy">
		<component
			v-for="section in sections"
			:is="sectionMap[section]"
			:key="section"
			:data="sectionsData[section]"
			:page="page"
		/>
	</main>
</template>

<style scoped></style>
