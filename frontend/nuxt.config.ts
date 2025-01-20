// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/strapi'],
	strapi: {
		url: process.env.STRAPI_URL || 'http://localhost:1337',
		prefix: '/api',
		version: 'v5',
	},
})
