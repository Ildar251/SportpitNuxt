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
export interface Taste {
    MIGX_id: string
    taste: string
    image: string
}

export interface DopCompound {
    MIGX_id: string
    name: string
    value: string
}

export interface ProductFull {
    id: number
    title: string
    description: string
    content: string
    parent: number
    category: string | null
    alias: string
    price?: string
    price_old?: string
    brand?: string
    taste?: Taste[]
    sticker?: string
    image?: string
    volume?: string
    product_text?: string
    sugar?: string
    energy?: string
    recommendations?: string
    storage?: string
    compound?: string
    dop_compound?: DopCompound[]
}
