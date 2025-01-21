export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	// devtools: { enabled: true },
	modules: ['@nuxtjs/strapi', '@nuxt/image'],
	strapi: {
		url: process.env.STRAPI_URL || 'http://localhost:1337',
		prefix: '/api',
		version: 'v5',
	},
	runtimeConfig: {
		public: {
			strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337'
		}
	},
	css: ['~/assets/styles/default.scss', '~/assets/styles/main.scss'],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/styles/_veriables.scss" as *;'
				}
			}
		}
	},
	image: {
		domains: ['localhost', 'localhost:1337'],
		provider: 'ipx'
	}
})