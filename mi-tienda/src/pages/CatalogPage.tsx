import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form, InputGroup, Nav, Navbar} from 'react-bootstrap';
import { ProductCard } from '../components/ProductCard';
import { CartOffCanvas } from '../components/CartOffCanvas';
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
    };

    const clearFilters = () => {
        setSearch('');
        setSearchInput('');
        setSelectedCategory('');
        setPage(1);
    };

    return (
        <div style={{ background: '#f7f7f7', minHeight: '100vh'}}>
            <Navbar bg="white" sticky="top" className="border-bottom px-4 py-3">
                <Navbar.Brand style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>
                    Logo
                </Navbar.Brand>
                <Form onSubmit={handleSearch} className="mx-auto" style={{ maxWidth: '100VH', width: 400 }}>
                    <InputGroup style={{ background: '#f5f5f5', borderRadius: 999, overflow: 'hidden', border: 'none' }}>
                        <InputGroup.Text style= {{ background: '#f5f5f5', border: 'none', padding: 16 }}>
                            <svg width="16" height="16" fill="none" stroke="#999" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35"/>
                            </svg>
                        </InputGroup.Text>
                        <Form.Control 
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Buscar productos..." 
                            style={{ background: '#f5f5f5', border: 'none', boxShadow: 'none', fontSize: 14 }}
                        ></Form.Control>
                        {(searchInput || selectedCategory) && (
                            <Button variant="link" onClick={clearFilters} style={{ color: '#aaa', textDecoration: 'none' }}>✕</Button>
                        )}
                    </InputGroup>
                </Form>

                <Nav className='ms-auto d-flex flex-row align-items-center gap-3'>
                    <Button variant='link' className='p-1 text-dark'>
                        <svg width= "22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                    </Button>
                    <Button variant="link" className="p-1 text-dark position-relative" onClick={() => setShowCart(true)}>
                        <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        {totalItems > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
                            style={{ fontSize: 10 }}>
                            {totalItems}
                        </span>
                        )}
                    </Button>
                </Nav>
            </Navbar>
            <Container style={{ maxWidth: 960, padding: '32px 16px' }}>

        {/* ── HERO BANNER ── */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '40px 48px',
          marginBottom: 40, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', overflow: 'hidden',
          position: 'relative', minHeight: 220,
        }}>
          <div style={{ maxWidth: 320, zIndex: 1 }}>
            <h1 style={{ fontWeight: 800, fontSize: 32, lineHeight: 1.2, letterSpacing: -1, marginBottom: 12 }}>
              Discover the Latest Products
            </h1>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
              Shop our new arrivals now.
            </p>
            <Button
              variant="dark"
              style={{ borderRadius: 999, padding: '12px 28px', fontWeight: 600 }}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </div>
          <div style={{
            position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
            width: 220, height: 220, background: '#f0f0f0', borderRadius: '50%',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
              alt="hero"
              style={{ width: '140%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* ── CATEGORÍAS ── */}
        {categorias.length > 0 && (
          <div className="d-flex gap-2 flex-wrap mb-2">
            <Button
              size="sm"
              variant={selectedCategory === '' ? 'dark' : 'outline-secondary'}
              style={{ borderRadius: 999 }}
              onClick={() => { setSelectedCategory(''); setPage(1); }}
            >
              All
            </Button>
            {categorias.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'dark' : 'outline-secondary'}
                style={{ borderRadius: 999, textTransform: 'capitalize' }}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* ── HEADER SECCIÓN ── */}
        <div id="products" className="d-flex align-items-center justify-content-between my-4">
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>Featured Products</h2>
            {totalProducts > 0 && (
              <small className="text-muted">{totalProducts} productos</small>
            )}
          </div>
          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-secondary" size="sm" style={{ borderRadius: 8 }}
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</Button>
              <small className="text-muted">{page} / {totalPages}</small>
              <Button variant="outline-secondary" size="sm" style={{ borderRadius: 8 }}
                disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>→</Button>
            </div>
          )}
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#111' }} />
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <Alert variant="danger" style={{ borderRadius: 12 }}>
            ⚠️ {error}
            <Button variant="outline-danger" size="sm" className="ms-3" onClick={loadProducts}>
              Reintentar
            </Button>
          </Alert>
        )}

        {/* ── GRID ── */}
        {!loading && !error && (
          products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: 40 }}>🔍</div>
              <p className="mt-3">No se encontraron productos</p>
              <Button variant="dark" style={{ borderRadius: 999 }} onClick={clearFilters}>
                Ver todos
              </Button>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} className="g-3">
              {products.map(product => (
                <Col key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )
        )}
      </Container>

      <CartOffCanvas show={showCart} onHide={() => setShowCart(false)} />
    </div>
  );
};
 