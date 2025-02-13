<script setup lang="ts">
defineProps<{ data?: { catalog_title?: string } }>()
</script>

<template>
    <section class="section section-catalog" id="catalog">
        <div class="container line-top ">
            <div class="section__header">
                <h2 class="h2">{{ data?.catalog_title || 'Каталог товаров' }}</h2>

                <NuxtLink to="/catalog" class="btn btn-more">
                    <span>Смотреть все</span>
                    <NuxtIcon name="arrow-right" />
                </NuxtLink>
            </div>
            <CardList />
        </div>
    </section>
</template>

<style lang="scss" scoped></style>