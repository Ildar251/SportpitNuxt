<script setup lang="ts">

interface Product {
    id: number
    title: string
    price: number
}

const { find } = useStrapi()
const { data: products } = await useAsyncData('products', async () => {
    const response = await find('products', { populate: '*' })
    console.log('Ответ от Strapi:', response)
    return response
})



</script>

<template>
    <!-- <CardList v-for="product in products" :key="product.id" :product="product">
        <Card :product="product" />
    </CardList> -->
</template>

<style scoped></style>