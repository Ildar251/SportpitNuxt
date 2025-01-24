<script lang="ts" setup>
const apiStore = useApiStore()

onMounted(() => {
    apiStore.fetchProducts()
})

const products = computed(() => apiStore.products)
console.log(apiStore.products)
</script>

<template>
    <div v-if="apiStore.loading">Загрузка...</div>
    <div class="card-list" v-else>
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
</style>