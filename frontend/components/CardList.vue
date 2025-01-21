<script lang="ts" setup>
// Определяем интерфейс продукта
interface Product {
    id: number
    title: string
    price: number
}

const { find } = useStrapi()


const { data: products } = await useAsyncData<Product[]>('products', async () => {
    const response = await find('products', { populate: '*' })
    console.log('Ответ от Strapi:', response)
    return response.data as Product[]
});


</script>
<template>
    <div class="card-list" v-if="products">
        <Card v-for="product in products" :key="product.id" :product="product" />
    </div>
</template>