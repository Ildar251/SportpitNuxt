<script setup lang="ts">
const props = defineProps<{ data?: { about_title?: string, about_text?: string, about_text_blog?: string, about_text_post?: string, about_file?: string } }>()

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl


const fileUrl = props.data?.about_file ? `${baseUrl}${props.data.about_file}` : '#'
</script>

<template>
    <section class="section section-about">
        <div class="container">
            <div class="about">
                <div class="about__top">
                    <NuxtImg src="/images/about_bloomit.svg" class="about__bloomit" />
                    <NuxtImg src="/images/about_planet.png" class="about__planet" />
                </div>
                <div class="about__center">
                    <h2 class="h2">{{ data?.about_title || 'О нас' }}</h2>
                    <p class="text" v-if="data?.about_text">
                        {{ data?.about_text }}
                    </p>
                    <NuxtLink to="/about" class="btn btn-more">
                        <span>Подробнее</span>
                        <NuxtIcon name="arrow-right" />
                    </NuxtLink>
                </div>
                <div class="about__bottom">
                    <div class="about__item">
                        <div class="about__link">
                            <NuxtLink to="/partners" class="link">Поставщикам</NuxtLink>
                        </div>

                        <div class="about__image">
                            <NuxtImg src="/images/about_post.png" class="image" />
                        </div>

                        <p class="text">
                            {{ data?.about_text_post }}
                        </p>
                    </div>
                    <div class="about__item">
                        <div class="about__link">
                            <NuxtLink class="link" to="/partners">Спорстменам</NuxtLink>
                            <NuxtLink class="link" to="/partners">Блогерам</NuxtLink>
                        </div>


                        <div class="about__image">
                            <NuxtImg src="/images/about_blogers.png" class="image" />
                        </div>

                        <p class="text">
                            {{ data?.about_text_blog }}
                        </p>
                    </div>
                </div>

                <a :href="fileUrl" target="_blank" download class="about__download">
                    <NuxtIcon name="nlo" />
                    <span>Скачать оптовый каталог</span>
                </a>
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
        height: auto-clamp(340px, 1000px);


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
            line-height: 1.4;
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
                color: $color-white;

                @media screen and (max-width: 768px) {
                    font-size: 30px;
                    color: $color-white;
                }
            }

            .about__image {
                position: relative;
                padding: 20px;

                @media screen and (max-width: 768px) {
                    padding: 0;
                }


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
                line-height: 1.4;
                letter-spacing: 0;

                @media screen and (max-width: 768px) {
                    margin-top: 0;
                }
            }
        }
    }

    .about__download {
        background-color: $color-accent;
        @include flex(column, flex-start, center);
        gap: 0;
        width: 100%;
        font-size: auto-clamp(36px, 124px);
        overflow: hidden;
        transition: 0.3s ease;
        text-align: center;
        max-height: auto-clamp(180px, 290px);
        padding-top: 35px;

        .nuxt-icon {
            transition: none;

            &:hover {
                color: $color-white;
            }
        }

        span {
            font-weight: 700;
        }

        &:hover {
            background-color: $color-orange;
            color: $color-white;
            max-height: 400px;
        }


    }
}
</style>