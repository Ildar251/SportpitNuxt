export interface Product {
    id: number
    title?: string
    price?: number
    image?: string
    volume?: number
    quantity: number
    taste?: string
    minQuantity?: number
}

export interface FavoriteProduct {
    id: number
    title?: string
    price?: number
    image?: string
    volume?: number
    taste?: string
    alias?: string
}

export interface DopCompound {
    MIGX_id: string
    title: string
    value: string
}

export interface ProductFull {
    id: number
    title: string
    longtitle: string
    alias: string
    description: string
    category: string
    image: string
    brand: string
    price: string
    price_old: string
    sticker: string
    taste: string
    volume: string
    product_text: string
    sugar: string
    energy: string
    recommendations: string
    storage: string
    compound: string
    dop_compound: Array<{
        MIGX_id: string
        title: string
        value: string
    }>
    quantity: string
}