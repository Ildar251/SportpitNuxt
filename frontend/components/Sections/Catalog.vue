<script setup lang="ts">
const apiStore = useApiStore()

// Загружаем данные, если они еще не загружены
if (!apiStore.resources.length) {
    await apiStore.fetchResources()
}

// Получаем ресурс с ID 4
const sectionData = computed(() => apiStore.getResourceById(4))
</script>

<template>
    <section class="section section-catalog">
        <div class="container line-top">
            <div class="section__header">
                <h2 class="h2">{{ sectionData?.pagetitle }}</h2>

                <NuxtLink to="/catalog" class="btn btn-more">
                    <span>Смотреть все</span>
                    <NuxtIcon name="arrow-right" />
                </NuxtLink>
            </div>

            <CardList />
        </div>
    </section>
</template>

<style lang="scss"></style>