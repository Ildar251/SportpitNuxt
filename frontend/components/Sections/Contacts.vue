<script setup lang="ts">
import { useSiteSettings } from '~/composables/useSiteSettings'
const settings = useSiteSettings()

const config = useRuntimeConfig()

const { loadYandexMaps, isYandexMapsLoaded } = useYandexMaps()
onMounted(() => {
    const apiKey = config.public.yandexMapsApiKey
    if (!apiKey) {
        console.error('Yandex Maps API ключ не найден в конфигурации!')
        return
    }

    const yandexMapsPromise = loadYandexMaps(apiKey)
    if (yandexMapsPromise) {
        yandexMapsPromise.catch((error) => {
            console.error('Не удалось загрузить Yandex Maps API:', error)
        })
    } else {
        console.error('Yandex Maps API уже загружен или не может быть загружен.')
    }
})


const mapCenter = computed<[number, number]>(() => {
    return [55.7558, 37.6173]
})

const mapPlacemark = computed<[number, number] | undefined>(() => {
    return undefined
})
</script>

<template>
    <section class="section section-contacts">
        <div class="container">
            <div class="contacts">
                <div class="contacts__info">
                    <div class="contacts__links">
                        <a :href="'mailto:' + settings.email" class="contacts__link contacts__link-email">
                            {{ settings.email }}
                        </a>
                        <a :href="'tel:' + settings.phone" class="contacts__link contacts__link-phone">
                            <span>{{ settings.phone }}</span>
                        </a>
                    </div>
                    <div class="contacts__social">
                        <NuxtLink :to="settings.telegram" target="_blank" class=" link">
                            telegram
                        </NuxtLink>
                        <NuxtLink :to="settings.whatsapp" target="_blank" class=" link">
                            whatsapp
                        </NuxtLink>
                        <NuxtLink :to="settings.vk" target="_blank" class=" link">
                            vk
                        </NuxtLink>
                    </div>
                </div>

                <div class="contacts__map">
                    <YaMap v-if="isYandexMapsLoaded" :center="mapCenter" :placemark="mapPlacemark" />

                    <div class="contacts__bottom">
                        <div class="contacts__item contacts__item-address">
                            <h3 class="h3">Адрес</h3>
                            <span>{{ settings.address }}</span>
                        </div>

                        <div class="contacts__item contacts__item-time">
                            <h3 class="h3">Режим работы</h3>
                            <span v-html="settings.time"></span>
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

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }

    &>div {
        padding-top: 42px;
    }

    .contacts__info {
        @include flex(column, flex-start, flex-start);
        gap: auto-clamp(22px, 72px);

        @media screen and (max-width: 768px) {
            width: 100%;
        }

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

        @media screen and (max-width: 768px) {
            width: 100%;
        }

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

        @media screen and (max-width: 768px) {
            flex-direction: column;
        }

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