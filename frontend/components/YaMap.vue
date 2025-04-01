<script lang="ts" setup>
const props = defineProps<{
	center: [number, number] // Координаты центра карты
	placemark?: [number, number] // Координаты метки (опционально)
}>()

let map: any = null
let isMapInitialized = false // Флаг для отслеживания инициализации карты

onMounted(() => {
	window.ymaps.ready(() => {
		initMap()
		isMapInitialized = true
		// Принудительно обновляем размеры карты после инициализации
		nextTick(() => {
			if (map) {
				map.container.fitToViewport()
			}
		})
	})
})

onUnmounted(() => {
	if (map) {
		map.destroy() // Уничтожаем карту при размонтировании компонента
		map = null
		isMapInitialized = false
	}
})

const initMap = () => {
	map = new window.ymaps.Map('yandex-map', {
		center: props.center,
		zoom: 10,
		controls: [], // Убираем стандартные контролы
	})

	// Создаем контейнер для кастомных контролов
	const customControlsContainer = document.createElement('div')
	customControlsContainer.className = 'custom-map-controls'
	document.getElementById('yandex-map')?.appendChild(customControlsContainer)

	// Создаем кнопки
	const zoomInButton = document.createElement('button')
	zoomInButton.className = 'map-control-button'
	zoomInButton.innerHTML = '+'
	zoomInButton.onclick = () => map.setZoom(map.getZoom() + 1)

	const zoomOutButton = document.createElement('button')
	zoomOutButton.className = 'map-control-button'
	zoomOutButton.innerHTML = '−'
	zoomOutButton.onclick = () => map.setZoom(map.getZoom() - 1)

	const geolocationButton = document.createElement('button')
	geolocationButton.className = 'map-control-button'
	geolocationButton.innerHTML = `
    <svg height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
      <g id="Navigation">
        <path d="m28.9092 4.4165-11 24a1 1 0 0 1 -1.9058-.3335l-.93-11.1567-11.1567-.93a1 1 0 0 1 -.3335-1.9058l24-11a1 1 0 0 1 1.3257 1.3257z"></path>
      </g>
    </svg>
  `
	geolocationButton.onclick = () => {
		window.ymaps.geolocation.get().then((res: any) => {
			const position = res.geoObjects.position
			map.setCenter(position, 14)
		})
	}

	// Добавляем кнопки в контейнер
	customControlsContainer.appendChild(zoomInButton)
	customControlsContainer.appendChild(zoomOutButton)
	customControlsContainer.appendChild(geolocationButton)

	// Добавляем метку, если переданы координаты placemark
	if (props.placemark) {
		const placemark = new window.ymaps.Placemark(
			props.placemark,
			{
				hintContent: 'Указанный адрес',
				balloonContent: 'Место доставки',
			},
			{
				iconLayout: 'default#image',
				iconImageHref: 'images/mapmark.svg', // Путь к иконке
				iconImageSize: [67, 80], // Размер иконки
				iconImageOffset: [-67, -40], // Смещение относительно точки
			}
		)
		map.geoObjects.add(placemark)
	}
}

// Обновляем карту при изменении координат
watch(
	() => props.center,
	(newCenter) => {
		if (map && isMapInitialized) {
			map.setCenter(newCenter, 14)
			nextTick(() => {
				map.container.fitToViewport()
			})
		}
	},
	{ immediate: true }
)

watch(
	() => props.placemark,
	(newPlacemark) => {
		if (map && isMapInitialized) {
			map.geoObjects.removeAll() // Удаляем старые метки
			if (newPlacemark) {
				const placemark = new window.ymaps.Placemark(
					newPlacemark,
					{
						hintContent: 'Указанный адрес',
						balloonContent: 'Место доставки',
					},
					{
						iconLayout: 'default#image',
						iconImageHref: 'images/mapmark.svg',
						iconImageSize: [67, 80],
						iconImageOffset: [-67, -40],
					}
				)
				map.geoObjects.add(placemark)
				map.setCenter(newPlacemark, 14)
				nextTick(() => {
					map.container.fitToViewport()
				})
			}
		}
	},
	{ immediate: true }
)
</script>
<template>
	<div id="yandex-map" class="map-container"></div>
</template>