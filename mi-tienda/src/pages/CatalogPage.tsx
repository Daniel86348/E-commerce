import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form, InputGroup, NavBar, Nav} from 'react-bootstrap';
import { ProductCard } from '../components/ProductCard';
import { CartOffcanvas } from '../components/CartOffcanvas';
import { fetchProducts, fetchCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const { totalItems } = useCart();

    const loadProducts = useCallback(async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchProducts({ search, category: selectedCategory, page })
                setProducts(data.products);
                setTotalPages(data.page);
                setTotalProducts(data.total);
            } catch {
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        }, [search,selectedCategory,page]
    );

    useEffect(() => { loadProducts(); }, [loadProducts]);
    useEffect(() => { fetchCategories().then(setCategorias).catch(() => {});},[]);

    const handleSearch = (e: React.FormEvent) =>{
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    }

}