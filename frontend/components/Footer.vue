<script setup lang="ts">
import { NuxtIcon, NuxtLink } from '#components'

</script>

<template>
    <footer class="footer">
        <div class="container">
            <div class="footer__top">
                <NuxtImg src="../public/images/logo_light.svg" alt="logo" width="260" />

                <div class="footer__contacts">
                    <a href="" class="footer__link">telegram</a>
                    <a href="" class="footer__link">whatsapp</a>
                    <a href="" class="footer__link">vk</a>
                </div>
            </div>

            <nav class="footer__nav">
                <div class="footer__column">
                    <h3 class="h3">Каталог</h3>
                    <ul class="footer__list">
                        <li class="footer__list-item">
                            <NuxtLink to="/">Спортивное питание</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Напитки</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Энергетики</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Батончики</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="footer__column">
                    <h3 class="h3">Инфо</h3>
                    <ul class="footer__list">
                        <li class="footer__list-item">
                            <NuxtLink to="/">О нас</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Вакансии</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Способы доставки</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Новости</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Контакты</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="footer__column">
                    <h3 class="h3">Партнёрам</h3>
                    <ul class="footer__list">
                        <li class="footer__list-item">
                            <NuxtLink to="/">Оптовым клиентам</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Поставщикам</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Спорстменам</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Блогерам</NuxtLink>
                        </li>
                        <li class="footer__list-item">
                            <NuxtLink to="/">Амбассадорам</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="footer__column">
                    <NuxtLink to="/" class="footer__phone footer__link">+7 945 998-99-65</NuxtLink>
                    <NuxtLink to="/" class="footer__email footer__link">support@sportpit.ru</NuxtLink>
                </div>
            </nav>

            <div class="footer__bottom">
                <div class="footer__bottom-left">
                    <NuxtLink to="/" class="footer__link">Политика конфиденциальности</NuxtLink>
                    <NuxtLink to="/" class="footer__link">Карта сайта</NuxtLink>
                </div>

                <NuxtLink to="/" class="footer__info">
                    <NuxtImg src="../public/images/topmarka.svg" alt="topmarka" />
                    <span>Создание сайта</span>
                </NuxtLink>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.footer {
    padding: 72px 0;
    background-color: $color-primary;
    color: $color-white;

    .footer__top {
        @include flex(row, space-between, center);
    }

    .footer__bottom {
        @include flex(row, space-between, center);
        border-top: 2px solid $color-border;
        padding-top: 26px;
        color: $color-gray;

        .footer__bottom-left {
            @include flex(row, space-between, center);
            gap: 24px;
        }
    }

    .footer__nav {
        border-top: 2px solid $color-border;
        margin-top: 120px;
        @include flex(row, space-between, flex-start);


        .footer__column {
            @include flex(column, flex-start, flex-start);
            gap: 6px;
            padding: 42px;
            position: relative;

            .footer__link {
                font-size: 31px;
            }

            &:not(:first-child)::before {
                content: '';
                display: block;
                width: 2px;
                height: 100%;
                max-height: 150px;
                background-color: $color-border;
                position: absolute;
                top: 0;
                left: 0;
            }

            .h3 {
                font-size: 38px;
                font-weight: 700;
                margin-bottom: 42px
            }

            .footer__list {
                @include flex(column, flex-start, flex-start);
                gap: 24px;

                .footer__list-item {
                    font-size: 22px;
                    color: $color-gray;
                }
            }
        }
    }

    .footer__contacts {
        display: flex;
        gap: auto-clamp(20px, 40px);

        .footer__link {
            font-size: 38px;
            position: relative;

            &::after {
                content: '';
                display: block;
                width: 13px;
                height: 13px;
                background-image: url('../public/images/link-arrow.svg');
                background-size: cover;
                position: absolute;
                right: -10px;
                top: -3px;
                transition: $transition;
            }

            &:hover {
                &::after {
                    transform: translate(3px, -3px)
                }
            }
        }
    }

    .footer__info {
        @include flex(column, flex-start, flex-start);
        gap: 8px;
        font-size: 10px;
    }
}
</style>