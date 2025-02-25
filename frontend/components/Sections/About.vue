<script setup lang="ts"></script>

<template>
    <section class="section section-about">
        <div class="container">
            <div class="about">
                <div class="about__top">
                    <NuxtImg src="/images/about_bloomit.svg" class="about__bloomit" />
                    <NuxtImg src="/images/about_planet.png" class="about__planet" />
                </div>
                <div class="about__center">
                    <h2 class="h2">О нас</h2>
                    <p class="text">
                        Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации,
                        например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь. Если
                        вам нужен Lorem Ipsum для серьёзного проекта, вам нужен Lorem Ipsum для серьёзного проекта
                    </p>
                    <div class="btn btn-more">
                        <span>Подробнее</span>
                        <NuxtIcon name="arrow-right" />
                    </div>
                </div>
                <div class="about__bottom">
                    <div class="about__item">
                        <div class="about__link">
                            <NuxtLink class="link">Поставщикам</NuxtLink>
                        </div>


                        <div class="about__image">
                            <NuxtImg src="/images/about_post.png" class="image" />
                        </div>

                        <p class="text">
                            Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые
                            модификации, например, юмористические вставки или слова, которые даже отдалённо не
                            напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного проекта
                        </p>
                    </div>
                    <div class="about__item">
                        <div class="about__link">
                            <NuxtLink class="link">Спорстменам</NuxtLink>
                            <NuxtLink class="link">Блогерам</NuxtLink>
                        </div>


                        <div class="about__image">
                            <NuxtImg src="/images/about_blogers.png" class="image" />
                        </div>

                        <p class="text">
                            Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые
                            модификации, например, юмористические вставки или слова, которые даже отдалённо не
                            напоминают латынь. Если вам нужен Lorem Ipsum для серьёзного проекта
                        </p>
                    </div>
                </div>

                <NuxtLink to="/" class="about__download">
                    <NuxtIcon name="nlo" />
                    <span>Скачать оптовый каталог</span>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.section-about {
    .container {
        @media screen and (max-width: 768px) {
            padding: 0;
        }
    }
}

.about {
    background-color: #000;
    position: relative;

    .about__top {
        @include flex(column, space-between, center);
        position: relative;
        background-image: url('@/assets/images/about_bg.png');
        background-size: 100% auto;
        background-position: top;
        background-repeat: no-repeat;
        padding: auto-clamp(30px, 67px);
        height: auto-clamp(500px, 1000px);


        .about__planet {
            position: absolute;
            bottom: 0;
        }

        .about__bloomit {
            width: 100%;
            position: relative;
            top: 30%;
        }


    }

    .about__center {
        position: relative;
        z-index: 2;
        color: #fff;
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        padding: 0 auto-clamp(30px, 67px);
        gap: 20px;

        @media screen and (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .h2 {
            font-size: auto-clamp(20px, 24px);
            color: $color-gray;
        }

        .text {
            font-size: auto-clamp(18px, 30px);
        }

        .btn {
            text-align: right;
            justify-content: flex-end;
        }
    }

    .about__bottom {
        @include flex(column, space-between, center);
        padding: 0 auto-clamp(30px, 67px);

        .about__item {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            border-top: 2px solid $color-light;
            margin-top: auto-clamp(60px, 140px);
            width: 100%;
            gap: 20px;

            @media screen and (max-width: 768px) {
                grid-template-columns: 1fr 1.8fr;
            }

            .about__link {
                @include flex(column, flex-start, flex-start);

                @media screen and (max-width: 768px) {
                    grid-column: span 2;
                }
            }

            .link {
                display: inline-block;
                font-size: auto-clamp(20px, 34px);
                margin-top: 20px;

                @media screen and (max-width: 768px) {
                    font-size: 30px;
                    color: $color-white;
                }
            }

            .about__image {
                position: relative;
                padding: 20px;

                &::before {
                    content: '';
                    display: block;
                    width: 1.5px;
                    height: 50%;
                    background-color: $color-light;
                    position: absolute;
                    left: 0;
                    top: 0;

                    @media screen and (max-width: 768px) {
                        display: none;
                    }
                }
            }

            .text {
                font-size: 16px;
                margin-top: 30px;
                color: $color-gray;
            }
        }
    }

    .about__download {
        background-color: $color-accent;
        @include flex(column, center, center);
        gap: 0;
        width: 100%;
        font-size: auto-clamp(36px, 124px);
        overflow: hidden;
        transition: 0.3s ease background-color, 0.3s ease color;
        text-align: center;

        &:hover {
            background-color: $color-orange;
            color: $color-white;
        }

        span {
            margin-bottom: calc(auto-clamp(15px, 50px) * -1);
        }
    }
}
</style>