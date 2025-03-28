<script lang="ts" setup>
</script>

<template>
    <section class="section section-seo">
        <div class="container">
            <div class="seo">
                <div class="seo__left">
                    <div class="seo__subtitle">Энергетики</div>
                    <h2 class="h2 seo__title">
                        Seo описание в несколько строк
                    </h2>
                </div>
                <div class="seo__text">
                    <p>Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем
                        так.
                        Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух
                        тысячелетий
                        назад. Ричард МакКлинток, профессор латыни из колледжа Hampden-Sydney, штат Вирджиния, взял одно
                        из
                        самых странных слов в Lorem Ipsum, "consectetur", и занялся его поисками в классической
                        латинской
                        литературе.</p>
                    <p>Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем
                        так.
                        Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух
                        тысячелетий
                        назад. Ричард МакКлинток, профессор латыни из колледжа Hampden-Sydney, штат Вирджиния, взял одно
                        из
                        самых странных слов в Lorem Ipsum, "consectetur", и занялся его поисками в классической
                        латинской
                        литературе.</p>
                </div>
                <div class="seo__images">
                    <NuxtImg src="/images/seo_img1.jpg" alt="seo" sizes="400px" />
                    <NuxtImg src="/images/seo_img2.jpg" alt="seo" sizes="400px" />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.seo {
    display: grid;
    grid-template-columns: 1.2fr 2fr 1.2fr;
    border-top: 2px solid $color-border;
    gap: auto-clamp(20px, 42px);

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }

    &>div {
        padding-top: auto-clamp(28px, 42px);
    }

    .seo__subtitle {
        font-size: auto-clamp(20px, 26px);
        color: $color-gray;
    }

    .seo__title {
        font-size: auto-clamp(28px, 42px);
        margin-top: 24px;
        padding-right: 20px;
    }

    .seo__text {
        position: relative;
        font-size: auto-clamp(16px, 18px);


        p {
            color: $color-gray;
            letter-spacing: 0;
            padding-right: auto-clamp(0px, 90px);
        }

        &::before {
            content: '';
            display: block;
            width: 2px;
            height: 200px;
            background-color: $color-border;
            position: absolute;
            top: 0;
            left: calc(auto-clamp(20px, 42px) * -1);
        }
    }

    .seo__images {
        @include flex(column, flex-start, flex-start);
        gap: auto-clamp(12px, 24px);
        width: 100%;

        @media screen and (max-width: 768px) {
            flex-direction: row;
            padding-top: 0;

            img {
                width: calc(50% - auto-clamp(6px, 12px));
            }
        }
    }
}
</style>