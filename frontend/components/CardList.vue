<script lang="ts" setup>
const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchProducts()
})

const props = defineProps<{ filters?: boolean }>()

const products = computed(() => props.filters ? apiStore.filteredProducts : apiStore.products)
</script>

<template>
    <div v-if="apiStore.loading">Загрузка...</div>
    <div :class="'card-list' + (filters ? ' card-list--filters' : '')" v-else v-auto-animate>
        <Card v-for="product in products" :product="product" :key="product.id" />
    </div>
</template>



<style lang="scss" scoped>
.card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 400px));
    gap: 24px;
    margin-top: 42px;
}

.card-list--filters {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    flex: 1;
}
</style>