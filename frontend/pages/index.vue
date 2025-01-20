<script setup lang="ts">

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
    <CardList v-if="products">
        <Card v-for="product in products" :key="product.id">
            <h3>{{ product.title }}</h3>
            <p>{{ product.price }}</p>
        </Card>
    </CardList>
</template>