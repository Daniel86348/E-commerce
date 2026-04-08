import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300?text=Sin+imagen';

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addtoCart } = useCart();

    return (
        
    );
}