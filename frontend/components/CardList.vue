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
const { data, pending, error } = useAsyncData('modxApi', async () => {
    const response = await axios.get('https://test.top-nnov.ru/api')
    return response.data
});

</script>
<template>

    <div>
        <h1>Данные из MODX API</h1>
        <div v-if="pending">Загрузка...</div>
        <div v-else-if="error">Ошибка: {{ error.message }}</div>
        <ul v-else>
            <li v-for="item in data" :key="item.id">
                <h2>{{ item.pagetitle }}</h2>
                <p>{{ item.introtext }}</p>
            </li>
        </ul>
    </div>
    <!-- <div class="card-list" v-if="products">
        <Card v-for="product in products" :key="product.id" :product="product" />
    </div> -->
</template>