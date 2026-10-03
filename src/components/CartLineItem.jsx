export default function CartLineItem({ item, onIncrement, onDecrement }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <div className="cart-item-title">{item.title}</div>
        {item.options?.hasBerenjena && (
          <span className="cart-item-meta">+ Berenjena</span>
        )}
        <div className="cart-item-price">S/ {(item.finalPrice * item.quantity).toFixed(2)}</div>
      </div>

      <div className="cart-item-controls">
        <button
          type="button"
          className="qty-btn"
          onClick={onDecrement}
          aria-label={`Quitar una unidad de ${item.title}`}
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          type="button"
          className="qty-btn"
          onClick={onIncrement}
          aria-label={`Agregar una unidad de ${item.title}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
