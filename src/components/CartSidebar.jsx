import OrderSummary from './OrderSummary';

export default function CartSidebar({ isOpen, onClose, cart, total, onCheckout }) {
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
            <OrderSummary cart={cart} total={total} />
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <button className="checkout-btn" onClick={onCheckout}>
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}

