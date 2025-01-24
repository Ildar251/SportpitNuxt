<script lang="ts" setup>
import { NuxtLink } from '#components'

</script>
<template>
    <header class="header">
        <div class="container">
            <div class="header__logo">
                <NuxtLink to="/">
                    <NuxtImg src="../public/images/favicon.svg" alt="logo" width="32" />
                </NuxtLink>
                <NuxtLink to="/">
                    <NuxtImg src="../public/images/logo.svg" alt="logo" width="142" />
                </NuxtLink>
            </div>

            <div class="header__catalog">
                <div class="header__shadow"></div>
                <div class="header__row">
                    <div class="burger burger_catalog">
                        <span></span>
                    </div>
                    <NuxtLink to="/catalog" class="header__menu-item"><span>Каталог</span></NuxtLink>
                </div>
            </div>

            <div class="header__navigation">
                <div class="header__contacts">
                    <a href="mailto:info@nutrivery.ru" class="header__link">info@nutrivery.ru</a>
                    <a href="tel:8 (800) 555-35-35" class="header__link">8 (800) 555-35-35</a>
                </div>
                <nav class="header__nav">
                    <ul class="header__menu">
                        <li class="header__menu-item">
                            <NuxtLink to="/catalog"><span>Бренды</span></NuxtLink>
                        </li>
                        <li class="header__menu-item">
                            <NuxtLink to="/catalog"><span>Акции</span></NuxtLink>
                        </li>
                        <li class="header__menu-item">
                            <NuxtLink to="/catalog"><span>Компания</span></NuxtLink>
                        </li>
                        <li class="header__menu-item">
                            <NuxtLink to="/catalog"><span>Партнёрам</span></NuxtLink>
                        </li>
                        <li class="header__menu-item">
                            <NuxtLink to="/catalog"><span>Контакты</span></NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>

            <div class="header__search">
                <div class="header__row">
                    <div class="header__social">
                        <a href="" class="header__link">telegram</a>
                        <a href="" class="header__link">whatsapp</a>
                        <a href="" class="header__link">vk</a>
                    </div>
                    <div class="header__client-links">
                        <NuxtIcon name="likes" />
                        <NuxtLink to="/login">
                            <NuxtIcon name="lk" />
                        </NuxtLink>
                    </div>
                </div>

                <div class="header__search-input">
                    <input type="text" placeholder="">
                </div>
            </div>

            <div class="header__cart">
                <NuxtIcon name="cart" />
                <NuxtLink to="/cart" class="header__menu-item"><span>Корзина</span></NuxtLink>
            </div>
        </div>
    </header>
</template>


<style lang="scss" scoped>
.header {
    padding-bottom: 30px;

    .container {
        display: grid;
        grid-template-columns: repeat(5, auto);

        &>div {
            display: grid;
            grid-template-rows: 20px auto;
            gap: 27px;
            align-items: center;
            padding: 24px auto-clamp(16px, 32px) 0;

            &:first-of-type {
                padding-left: 0;
            }

            &:last-of-type {
                padding-right: 0;
            }
        }
    }

    .header__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }
}

.header__catalog {
    border-left: 1px solid $color-light;
    border-right: 1px solid $color-light;

    a {
        font-size: auto-clamp(14px, 20px);
    }
}

.burger {
    @include flex(column, center, center);
    gap: 6px;
    cursor: pointer;
    position: relative;
    height: 12px;

    span {
        display: block;
        width: auto-clamp(36px, 72px);
        height: 2px;
        background-color: $color-primary;

        &::before {
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background-color: $color-primary;
            position: absolute;
            top: 0px;
        }

        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 2px;
            background-color: $color-primary;
            position: absolute;
            bottom: 0px;
        }
    }
}


.header__search-input {
    position: relative;

    input {
        width: 100%;
        height: 40px;
        padding: 0 20px 0 50px;
        background-color: $color-light;
        border: none;
        transition: $transition;
        border: 2px solid transparent;

        &:focus {
            border: 2px solid $color-accent;
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: calc(50% - 10px);
        width: 20px;
        height: 20px;
        right: 30px;
        background-image: url('~/public/images/search.svg');
    }
}

.header__search {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.header__contacts {
    display: flex;
    gap: auto-clamp(25px, 50px);
}

.header__link {
    font-size: 16px;
    color: $color-gray;
    position: relative;
    transition: $transition;

    &:hover {
        color: $color-accent;
    }
}

.header__social {
    display: flex;
    gap: auto-clamp(15px, 30px);

    .header__link {
        &::after {
            content: '';
            display: block;
            width: 9px;
            height: 9px;
            background-image: url('../public/images/link-arrow.svg');
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

.header__menu {
    display: flex;
    gap: auto-clamp(16px, 32px);
    margin-bottom: 0;
}

.header__menu-item {
    font-weight: 700;
    font-size: auto-clamp(16px, 20px);
    transition: $transition;

    &:hover {
        color: $color-accent;
    }
}

.header__client-links {
    display: flex;
    gap: 17px;
}

.header__search-input {
    input {
        width: 100%;
        padding: 8px;
    }
}

.header__cart {
    border-left: 1px solid $color-light;
}
</style>