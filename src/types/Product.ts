export interface Product {
    id: string,
    title: string,
    price: string,
    description: string,
    category: string,
    image: string,
    rating?: ProductRating
}

interface ProductRating {
    rate?: string,
    count?: string
}