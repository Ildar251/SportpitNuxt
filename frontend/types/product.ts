export interface Product {
    id: number
    title?: string
    price?: number
    image?: string
    volume?: number
    quantity: number // Только для корзины
}

export interface FavoriteProduct {
    id: number
    title?: string
    price?: number
    image?: string
    volume?: number
}