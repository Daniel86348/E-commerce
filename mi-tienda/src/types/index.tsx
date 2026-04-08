export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageURL?: string;
    createdAt: string;
}

export interface ProductsResponse {
    total: number;
    page: number;
    pages: number;
    products: Product[];    
}

export interface CartItem {
    product: Product;
    quantity: number;
}