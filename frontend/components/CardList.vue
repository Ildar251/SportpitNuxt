<script lang="ts" setup>
// Определяем интерфейс продукта
interface Product {
    id: number
    title: string
    price: number
}

// const { find } = useStrapi()


// const { data: products } = await useAsyncData<Product[]>('products', async () => {
//     const response = await find('products', { populate: '*' })
//     console.log('Ответ от Strapi:', response)
//     return response.data as Product[]
// });

import axios from 'axios'
const { data, status } = useAsyncData('modxApi', async () => {
    const response = await axios.get('https://test.top-nnov.ru/api')
    return response.data
});

</script>
<template>


    <div v-if="status === 'pending'">Загрузка...</div>
    <div class="card-list" v-else>
        <Card v-for="product in data" :key="product.id" :product="product" />
    </div>
</template>