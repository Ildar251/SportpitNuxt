export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxt/image', 'nuxt-icons', '@pinia/nuxt', '@formkit/auto-animate/nuxt'],
	runtimeConfig: {
		public: {
			apiUrl: process.env.apiUrl || 'http://localhost:1337'
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