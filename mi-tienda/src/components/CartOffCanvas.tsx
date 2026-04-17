import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext";

interface CartOffCanvasProps {
    show: boolean;
    onHide: () => void;
}

export const CartOffCanvas = ({ show, onHide }: CartOffCanvasProps) => {
    const { items, removeFromCart , updateQuantity , totalPrice , clearCart } = useCart();

    return (
        <Offcanvas show = {show} onHide={onHide} placement ="end">
            <Offcanvas.Header closeButton className="border-bottom px-4">
                <Offcanvas.Title style={{ fontWeight: 700, fontSize:18 }}>
                    Carrito de Compras
                    {items.length > 0 && (
                        <Badge style= {{ background: '#111', marginLeft: 8, borderRadius: 999 }}>
                            {items.length}
                        </Badge>
                    )}
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className= "d-flex flex-column px-4">
                {items.length === 0 ? (
                    <div className="text-center text-muted my-auto">
                        <div style={{ fontSize: 48}}>🛍️</div>
                        <p className="mt-2" style={{ fontSize: 14 }}>Tu carrito está vacío</p>
                    </div>

                ):(
                    <>
                    <ListGroup variant = "flush" className= "flex-grow-1 overflow-auto">
                        {items.map(({ product, quantity }) => (
                            <ListGroup.Item key = {product._id} className ="px-0 py-3">
                                <div className="d-flex gap-3 align-items-start">
                                    <img
                                        src={product.imageURL || 'https://placehold.co/60x60?text=?'}
                                        alt={product.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, background: '#f5f5f5' }}
                                    />
                                    <div className="flex-grow-1">
                                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{product.name}</div>
                                        <div style = {{ color: '#aaa', fontSize: 12, marginBottom: 8}}>${product.price.toFixed(2)} c/u</div>

                                        <div className="d-flex align-items-center gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                style={{ width:26, height:26, padding: 0, borderRadius: 6, lineHeight: 1}}
                                                onClick={() => updateQuantity(product._id, quantity - 1)}
                                            >
                                                -
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                style={{ width:26, height:26, padding: 0, borderRadius: 6, lineHeight: 1}}
                                                onClick={() => updateQuantity(product._id, quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <div style= {{ fontWeight: 700, fontSize:14 }}>${(product.price * quantity).toFixed(2)}
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-danger p-0 mt-1"
                                                style={{ fontSize:12 }}
                                                onClick={()=> removeFromCart(product._id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item> 
                        ))}
                    </ListGroup>
                    <div className="border-top pt-3 pb-4">
                        <div className="d-flex justify-content-between fw-bold mb-3" style={{ fontSize: 16}}>
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Button
                            variant="dark"
                            className="w-100 mb-2"
                            style={{ borderRadius: 999, padding: '12px', fontWeight: 600}}
                        >
                            Proceder al pago
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            style={{ borderRadius: 999, padding: '10px', fontWeight: 500, fontSize: 13}}
                            onClick={clearCart}
                        >
                            Vaciar carrito
                        </Button>
                    </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};