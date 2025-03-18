<script lang="ts" setup>
const config = useRuntimeConfig()
const yandexApiKey = config.public.yandexMapsApiKey

onMounted(() => {
	const script = document.createElement("script")
	script.src = `https://api-maps.yandex.ru/2.1/?apikey=${yandexApiKey}&lang=ru_RU`
	script.onload = initMap
	document.body.appendChild(script)
})

const initMap = () => {
	if (!window.ymaps) return

	window.ymaps.ready(() => {
		const map = new window.ymaps.Map("yandex-map", {
			center: [55.766030, 37.594396], // Москва
			zoom: 10,
			controls: [], // Убираем стандартные контролы
		})

		// Создаем контейнер для кастомных контролов
		const customControlsContainer = document.createElement("div")
		customControlsContainer.className = "custom-map-controls"
		document.getElementById("yandex-map")?.appendChild(customControlsContainer)

		// Создаем кнопки
		const zoomInButton = document.createElement("button")
		zoomInButton.className = "map-control-button"
		zoomInButton.innerHTML = "+"
		zoomInButton.onclick = () => map.setZoom(map.getZoom() + 1)

		const zoomOutButton = document.createElement("button")
		zoomOutButton.className = "map-control-button"
		zoomOutButton.innerHTML = "−"
		zoomOutButton.onclick = () => map.setZoom(map.getZoom() - 1)

		const geolocationButton = document.createElement("button")
		geolocationButton.className = "map-control-button"
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

		// Добавляем метку
		const placemark = new window.ymaps.Placemark(
			[55.766030, 37.594396],
			{
				hintContent: "Мы здесь!",
				balloonContent: "Наш офис",
			},
			{
				iconLayout: "default#image",
				iconImageHref: "images/mapmark.svg", // Путь к иконке
				iconImageSize: [67, 80], // Размер иконки
				iconImageOffset: [-67, -40], // Смещение относительно точки (центр внизу)
			}

		)

		map.geoObjects.add(placemark)
	})


}
</script>

<template>
	<div id="yandex-map" class="map-container"></div>
</template>
