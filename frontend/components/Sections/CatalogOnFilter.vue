<script setup lang="ts">
defineProps<{ data?: { catalog_title?: string } }>()
</script>

<template>
    <section class="section section-catalog" id="catalog">
        <div class="container line-top  row">
            <CatalogFilter />
            <CardList :filters="true" />
        </div>
    </section>
</template>

<style lang="scss"></style>