<script lang="ts" setup>
</script>

<template>
    <section class="section section-capture">
        <div class="container">
            <div class="capture">
                <div class="capture__image">
                    <NuxtImg src="/images/capture-image.png" />
                </div>

                <div class="capture__form">
                    <h2 class="h2">Ответим на все ваши вопросы</h2>
                    <form action="" class="form form-dark">
                        <input type="text" placeholder="Ваше имя" />
                        <input type="tel" placeholder="Ваш телефон" />
                        <input type="text" placeholder="Ваша компания" />
                        <button type="submit">Отправить</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" scoped>
.capture {
    display: grid;
    grid-template-columns: 1fr 2fr;
    width: 100%;
    gap: 20px;
    color: $color-white;

    @media screen and (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    .capture__image {
        width: 100%;
        height: auto;

        @media screen and (max-width: 1024px) {
            display: none;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
        }
    }

    .capture__form {
        @include flex(column, flex-start, flex-start);
        background-color: $color-primary;
        flex: 1;
        height: auto;
        margin-top: 62px;
        padding: auto-clamp(36px, 72px) auto-clamp(60px, 120px);
        background-image: url(/images/capture_bg.png);
        background-repeat: no-repeat;
        background-position: center right 40px;

        @media screen and (max-width: 1024px) {
            margin-top: 0px;
        }

        .h2 {
            font-size: auto-clamp(32px, 42px);
        }

        .form {
            margin-top: 42px;

            input {
                margin-bottom: 20px;
            }

            button {
                max-width: auto-clamp(320px, 420px);
            }
        }
    }
}
</style>