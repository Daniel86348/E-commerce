import { Card, Button, Badge } from 'react-bootstrap';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/300x300?text=Sin+imagen';

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    return (
        <Card
        className="border-0  h-100"
        style ={{borderRadius:16, overflow:'hidden', transition: 'box-shadow 0.2s'}}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10' )}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >

            <div
                style={{ background: '#f5f5f5', height: 200, overflow: 'hidden', position: 'relative'}}>
                    <Card.Img
                        variant="top"
                        src={product.imageURL || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {product.stock === 0 && (
                        <Badge
                            bg="danger"
                            style={{ position: 'absolute', top: 10, right: 10, borderRadius: 999, fontSize: 11 }}
                        >
                            Agotado
                        </Badge>
                    )}
            </div>
            <Card.Body className="d-flex flex-column p-3">
                <Card.Title style={{
                    fontWeight: 600, fontSize: 14, marginBottom: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}
                />
                {product.name}
                <Card.Text style={{ color: '#aaa', fontSize: 12, textTransform: 'capitalize', marginBottom: 12 }}>
                    {product.category || 'Sin categoría'}
                </Card.Text>

                <div className="d-flex justify-content-between mt-auto">
                    <span style = {{ fontWeight: 700, fontSize: 18 }}>${product.price.toFixed(2)}</span>
                    <Button 
                    variant="outline-dark"
                    size='sm'
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                    style={{ borderRadius: 999, fontSize:12, fontWeight:600, padding:'7px 16px'}}
                    >
                        {product.stock === 0 ? 'Añadir al carro' : 'No disponible'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}