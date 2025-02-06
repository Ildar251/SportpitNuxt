import { useApiStore } from '~/stores/api'

export function useBrand() {
	const apiStore = useApiStore()

	const getBrandTitle = (brandId: number): string => {
		const brand = apiStore.brands.find(brand => brand.id === brandId)
		return brand ? brand.title : 'Товар'
	}

	return {
		getBrandTitle,
	}
}
