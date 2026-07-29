export default function OrderSummary({ cart, total }) {
  return (
    <div className="order-summary-card">
      <h3 className="summary-title">Resumen de tu pedido</h3>
      <div className="receipt">
        {cart.map(item => (
          <div className="receipt-item" key={item.cartItemId}>
            <span className="receipt-item-name">{item.quantity}x {item.title}</span>
            <span className="receipt-item-price">S/ {(item.finalPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="receipt-total">
        <span className="receipt-total-label">TOTAL</span>
        <span className="receipt-total-amount">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
