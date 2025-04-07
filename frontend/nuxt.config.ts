export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/image',
		'nuxt-icons',
		'@pinia/nuxt',
		'@formkit/auto-animate/nuxt',
		'motion-v/nuxt'
	],

	ssr: true,


	runtimeConfig: {
		public: {
			apiUrl: process.env.apiUrl,
			yandexMapsApiKey: process.env.YANDEX_MAPS_API_KEY,
			dadataApiKey: process.env.DADATA_API_KEY,
		},
	},
	css: ['~/assets/styles/default.scss', '~/assets/styles/main.scss'],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/styles/_veriables.scss" as *;',
				},
			},
		},
	},
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
	},
	plugins: ['~/plugins/auth.ts'],
	image: {
		domains: ['test.top-nnov.ru'],
		dir: 'public',
		provider: 'vercel',
		vercel: {
			modifiers: {
				format: 'webp',
			},
		},
	},
})
