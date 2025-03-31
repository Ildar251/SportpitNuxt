<script setup lang="ts">
import { useSiteSettings } from '~/composables/useSiteSettings'
const settings = useSiteSettings()
</script>

<template>
	<p class="text">Связаться с нами через мессенджеры</p>
	<div class="links">
		<a :href="settings.telegram" class="link">telegram</a>
		<a :href="settings.whatsapp" class="link">whatsapp</a>
		<a :href="settings.vk" class="link">vk</a>
	</div>
</template>

<style lang="scss" scoped>
.text {
	font-size: auto-clamp(22px, 32px);
	color: $color-primary;
	font-weight: bold;
}
.links {
	@include flex(row, flex-start, center);
	gap: 40px;

	.link {
		font-size: auto-clamp(22px, 32px);
		color: $color-primary;
	}
}
</style>
