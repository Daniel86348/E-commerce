import  { type ProductsResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchProductsParams {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
}

export const fetchProducts = async ({
    search = '',
    category = '',
    page = 1,
    limit = 12
}: FetchProductsParams={}): Promise<ProductsResponse> => {
    try{
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        const response = await fetch(`${API_URL}/products?${params.toString()}`);
        if (!response.ok){
            throw new Error("Error al cargar los productos");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar los productos:");
        throw error;
    }
};

export const fetchCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/products?limit=100`);
        if (!response.ok) {
            throw new Error("Error al cargar las categorías");
        }
        const data: ProductsResponse = await response.json();
        const categories = [...new Set(data.products.map((p) => p.category).filter(Boolean))];
        return categories.sort();
    }
    catch (error) {
        console.error("Error al cargar las categorías:");
        throw error;
    }
}
