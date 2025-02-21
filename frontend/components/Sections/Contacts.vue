<script setup lang="ts">
import { onMounted } from "vue"

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
                iconImageSize: [100, 120], // Размер иконки
                iconImageOffset: [-100, -60], // Смещение относительно точки (центр внизу)
            }

        )

        map.geoObjects.add(placemark)
    })


}
</script>

<template>
    <section class="section section-contacts">
        <div class="container">
            <div class="contacts">
                <div class="contacts__info">
                    <div class="contacts__links">
                        <NuxtLink to="mailto:info@bloomit.ru" class="contacts__link contacts__link-email">
                            info@bloomit.ru
                        </NuxtLink>
                        <NuxtLink to="tel:+7 945 998-99-65" class="contacts__link contacts__link-phone">
                            +7 945 998-99-65
                        </NuxtLink>
                    </div>
                    <div class="contacts__social">
                        <NuxtLink to="" class="link">telegram</NuxtLink>
                        <NuxtLink to="" class="link">whatsapp</NuxtLink>
                        <NuxtLink to="" class="link">vk</NuxtLink>
                    </div>
                </div>

                <div class="contacts__map">
                    <div id="yandex-map" class="map-container"></div>

                    <div class="contacts__bottom">
                        <div class="contacts__item contacts__item-address">
                            <h3 class="h3">Адрес</h3>
                            <span>Ермолаевский переулок, 22-26с1, Москва, 123001</span>
                        </div>

                        <div class="contacts__item contacts__item-time">
                            <h3 class="h3">Режим работы</h3>
                            <span>пн-пт 9:00 — 18:00</span>
                            <span>сб-вс 10:00 — 16:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped>
.contacts {
    display: grid;
    grid-template-columns: 1fr 3fr;
    border-top: 2px solid $color-border;
    gap: 42px;

    &>div {
        padding-top: 42px;
    }

    .contacts__info {
        @include flex(column, flex-start, flex-start);
        gap: auto-clamp(22px, 72px);

        .contacts__links {
            @include flex(column, flex-start, flex-start);
            gap: 24px;
            font-size: auto-clamp(22px, 42px);
        }

        .contacts__social {
            @include flex(column, flex-start, flex-start);
            gap: 24px;

            .link {
                font-size: auto-clamp(22px, 38px);
            }

        }
    }

    .contacts__map {
        position: relative;


        &::before {
            content: '';
            display: block;
            width: 2px;
            height: 100%;
            max-height: 150px;
            background-color: $color-border;
            position: absolute;
            top: 0;
            left: -42px;
        }
    }

    .contacts__bottom {
        display: flex;
        margin-top: 24px;
        gap: 12px;

        .contacts__item {
            background-color: $color-light;
            padding: 42px;
            flex: 1;

            .h3 {
                font-size: auto-clamp(22px, 32px);
                border-bottom: 2px solid #A7ADBA99;
                padding-bottom: 24px;
                margin-bottom: 24px;
            }

            span {
                color: $color-gray;
                display: block;
                font-weight: 500;
                font-size: auto-clamp(16px, 24px);
            }
        }
    }
}
</style>