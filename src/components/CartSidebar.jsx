export default function CartSidebar({ isOpen, onClose, cart, updateQuantity, total, onCheckout }) {
  return (
    <>
      <div 
        className={`cart-sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>🛒 Tu Pedido</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              Tu carrito está vacío. ¡Agrega algunos jugos o sándwiches!
            </p>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId} className="cart-item">
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  {item.options?.hasBerenjena && (
                    <div className="cart-item-meta">+ Berenjena</div>
                  )}
                  <div className="cart-item-price">S/ {item.finalPrice.toFixed(2)}</div>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.cartItemId, -1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.cartItemId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}
