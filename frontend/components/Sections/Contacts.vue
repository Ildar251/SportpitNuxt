<script setup lang="ts">


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
                    <YaMap />

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