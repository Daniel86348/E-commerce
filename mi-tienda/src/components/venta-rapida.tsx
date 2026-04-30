export default function CashierPOS() {
  import { useState, useEffect, useRef, useCallback } from "react";
  import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Badge,
    Alert,
    Spinner,
    InputGroup,
  } from "react-bootstrap";


  // ─── Types ───────────────────────────────────────────────────────────────────

  interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }

  interface CartItem {
    product: Product;
    quantity: number;
  }

  interface OrderItem {
    productId: string;
    quantity: number;
  }

  // ─── Config ──────────────────────────────────────────────────────────────────

  const API_BASE = "http://localhost:5000/api";
  const TOKEN = localStorage.getItem("token") || "";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };

  // ─── Component ───────────────────────────────────────────────────────────────

  export default function CashierPOS() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saleLoading, setSaleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [shippingAddress, setShippingAddress] = useState("Mostrador");
    const searchRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-focus search on mount
    useEffect(() => {
      searchRef.current?.focus();
    }, []);

    // Debounced product search
    const searchProducts = useCallback(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al consultar productos");
        const data: Product[] = await res.json();
        // Client-side filter by name, id substring or category
        const lower = q.toLowerCase();
        setResults(
          data.filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p._id.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower)
          )
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error de red");
      } finally {
        setLoading(false);
      }
    }, []);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => searchProducts(val), 300);
    };

    // Add product to cart
    const addToCart = (product: Product) => {
      if (product.stock === 0) {
        setError(`"${product.name}" sin stock`);
        return;
      }
      setCart((prev) => {
        const existing = prev.find((i) => i.product._id === product._id);
        if (existing) {
          if (existing.quantity >= product.stock) {
            setError(`Stock máximo alcanzado para "${product.name}"`);
            return prev;
          }
          return prev.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
      setQuery("");
      setResults([]);
      searchRef.current?.focus();
    };

    // Update quantity
    const updateQty = (id: string, qty: number) => {
      if (qty < 1) return removeFromCart(id);
      setCart((prev) =>
        prev.map((i) => (i.product._id === id ? { ...i, quantity: qty } : i))
      );
    };

    const removeFromCart = (id: string) => {
      setCart((prev) => prev.filter((i) => i.product._id !== id));
    };

    // Total
    const total = cart.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );

    // Quick sale
    const handleSale = async () => {
      if (cart.length === 0) return;
      setSaleLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const items: OrderItem[] = cart.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        }));
        const res = await fetch(`${API_BASE}/orders`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ items, shippingAddress }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Error al crear orden");
        }
        const order = await res.json();
        setSuccess(`✓ Orden #${order._id?.slice(-6).toUpperCase()} creada — Total: $${total.toFixed(2)}`);
        setCart([]);
        searchRef.current?.focus();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al procesar venta");
      } finally {
        setSaleLoading(false);
      }
    };

    // Keyboard: Enter on search selects first result
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && results.length > 0) {
        addToCart(results[0]);
      }
    };

    return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;600&display=swap');

        :root {
          --bg: #0d0e11;
          --surface: #16181d;
          --border: #252830;
          --accent: #00e5a0;
          --accent-dim: rgba(0,229,160,0.12);
          --text: #e8eaf0;
          --muted: #6b7280;
          --danger: #ff4757;
          --warning: #ffa502;
        }

        body { background: var(--bg) !important; }

        .pos-wrap {
          font-family: 'IBM Plex Sans', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--text);
          padding: 1.5rem 1rem;
        }

        .pos-header {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .pos-header .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          flex-shrink: 0;
        }

        /* Search */
        .search-input {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 1rem !important;
          border-radius: 4px !important;
          padding: 0.65rem 1rem !important;
          transition: border-color 0.15s;
        }
        .search-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px var(--accent-dim) !important;
          outline: none !important;
        }
        .search-input::placeholder { color: var(--muted) !important; }

        .search-addon {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-left: none !important;
          color: var(--muted) !important;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
        }

        /* Results dropdown */
        .results-list {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 4px 4px;
          overflow: hidden;
          position: absolute;
          width: 100%;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .result-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background 0.1s;
        }
        .result-row:last-child { border-bottom: none; }
        .result-row:hover { background: var(--accent-dim); }

        .result-name {
          font-size: 0.9rem;
          font-weight: 600;
          flex: 1;
        }
        .result-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: var(--accent);
        }
        .result-stock {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
        }

        /* Cart table */
        .cart-table {
          font-size: 0.88rem;
          width: 100%;
          border-collapse: collapse;
        }
        .cart-table thead tr {
          border-bottom: 1px solid var(--border);
        }
        .cart-table thead th {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 0.5rem 0.5rem 0.75rem;
          font-weight: 400;
        }
        .cart-table tbody tr {
          border-bottom: 1px solid var(--border);
        }
        .cart-table tbody tr:last-child { border-bottom: none; }
        .cart-table td {
          padding: 0.6rem 0.5rem;
          vertical-align: middle;
        }

        .qty-input {
          background: var(--bg) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 0.85rem !important;
          text-align: center;
          width: 56px !important;
          padding: 0.25rem !important;
          border-radius: 3px !important;
        }

        .remove-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 1rem;
          padding: 0;
          line-height: 1;
          cursor: pointer;
          transition: color 0.15s;
        }
        .remove-btn:hover { color: var(--danger); }

        /* Total */
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        .total-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .total-amount {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--accent);
        }

        /* Sale button */
        .sale-btn {
          background: var(--accent) !important;
          border: none !important;
          color: #000 !important;
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 0.75rem !important;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600 !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 4px !important;
          transition: opacity 0.15s, box-shadow 0.15s !important;
          width: 100%;
        }
        .sale-btn:hover:not(:disabled) {
          opacity: 0.88;
          box-shadow: 0 0 16px rgba(0,229,160,0.35) !important;
        }
        .sale-btn:disabled { opacity: 0.4 !important; }

        /* Alerts */
        .pos-alert {
          background: transparent !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-size: 0.82rem;
          border-radius: 4px;
          padding: 0.6rem 0.9rem;
        }
        .pos-alert.error {
          border-color: var(--danger) !important;
          color: var(--danger) !important;
        }
        .pos-alert.success {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }

        /* Address input */
        .addr-input {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-family: 'IBM Plex Mono', monospace !important;
          font-size: 0.8rem !important;
          border-radius: 4px !important;
          padding: 0.4rem 0.75rem !important;
        }
        .addr-input:focus {
          border-color: var(--accent) !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.6rem;
        }

        .empty-cart {
          text-align: center;
          color: var(--muted);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          padding: 2rem 0;
          border-top: 1px solid var(--border);
        }

        .badge-cat {
          background: var(--border) !important;
          color: var(--muted) !important;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          border-radius: 2px;
        }
      `}</style>

        <div className="pos-wrap">
          <Container fluid style={{ maxWidth: 900 }}>
            {/* Header */}
            <div className="pos-header">
              <span className="dot" />
              <span>Punto de venta — Cajero</span>
            </div>

            {/* Alerts */}
            {error && (
              <div className="pos-alert error mb-3">⚠ {error}</div>
            )}
            {success && (
              <div className="pos-alert success mb-3">{success}</div>
            )}

            <Row className="g-4">
              {/* LEFT: Search */}
              <Col md={5}>
                <div className="section-label">Buscar producto</div>

                <div style={{ position: "relative" }}>
                  <InputGroup>
                    <Form.Control
                      ref={searchRef}
                      className="search-input"
                      placeholder="Nombre, ID o categoría…"
                      value={query}
                      onChange={handleQueryChange}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                    />
                    <InputGroup.Text className="search-addon">
                      {loading ? (
                        <Spinner size="sm" style={{ width: 10, height: 10, borderWidth: 1 }} />
                      ) : (
                        "↵"
                      )}
                    </InputGroup.Text>
                  </InputGroup>

                  {/* Results */}
                  {results.length > 0 && (
                    <div className="results-list">
                      {results.map((p) => (
                        <div
                          key={p._id}
                          className="result-row"
                          onClick={() => addToCart(p)}
                        >
                          <div className="result-name">
                            {p.name}
                            <span className="ms-2">
                              <Badge className="badge-cat">{p.category}</Badge>
                            </span>
                          </div>
                          <div className="result-stock">×{p.stock}</div>
                          <div className="result-price">
                            ${p.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="mt-4">
                  <div className="section-label">Punto de entrega</div>
                  <Form.Control
                    className="addr-input"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Mostrador / dirección…"
                  />
                </div>
              </Col>

              {/* RIGHT: Cart */}
              <Col md={7}>
                <div className="section-label">
                  Carrito{" "}
                  {cart.length > 0 && (
                    <span style={{ color: "var(--accent)" }}>
                      — {cart.reduce((s, i) => s + i.quantity, 0)} ítem(s)
                    </span>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="empty-cart">— carrito vacío —</div>
                ) : (
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th style={{ textAlign: "center" }}>Cant.</th>
                        <th style={{ textAlign: "right" }}>Precio</th>
                        <th style={{ textAlign: "right" }}>Subtotal</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(({ product, quantity }) => (
                        <tr key={product._id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                              {product.name}
                            </div>
                            <div
                              style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "0.62rem",
                                color: "var(--muted)",
                              }}
                            >
                              {product._id.slice(-8).toUpperCase()}
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Form.Control
                              type="number"
                              min={1}
                              max={product.stock}
                              value={quantity}
                              className="qty-input"
                              onChange={(e) =>
                                updateQty(product._id, parseInt(e.target.value) || 1)
                              }
                            />
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: "0.82rem",
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: "0.88rem",
                              color: "var(--accent)",
                            }}
                          >
                            ${(product.price * quantity).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="remove-btn"
                              onClick={() => removeFromCart(product._id)}
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Total + Sale button */}
                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                <div className="mt-3">
                  <Button
                    className="sale-btn"
                    disabled={cart.length === 0 || saleLoading}
                    onClick={handleSale}
                  >
                    {saleLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Procesando…
                      </>
                    ) : (
                      " Venta rápida"
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}