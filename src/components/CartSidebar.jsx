import { useEffect, useRef, useState } from 'react';
import CartLineItem from './CartLineItem';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const CLOSE_DRAG_THRESHOLD = 110;

export default function CartSidebar({ isOpen, onClose, cart, total, onIncrement, onDecrement, onRemove, onCheckout }) {
  useBodyScrollLock(isOpen);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDragStart = (e) => {
    dragStartY.current = e.clientY;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const delta = e.clientY - dragStartY.current;
    if (delta > 0) setDragY(delta);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* no-op */ }
    if (dragY > CLOSE_DRAG_THRESHOLD) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <>
      <div
        className={`cart-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`cart-sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
      >
        <div
          className="drag-handle"
          aria-hidden="true"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <span className="drag-handle-bar"></span>
        </div>

        <div className="cart-header">
          <h2>🛒 Tu Pedido</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">&times;</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              Tu carrito está vacío. ¡Agrega algunos jugos o sándwiches!
            </p>
          ) : (
            cart.map((item) => (
              <CartLineItem
                key={item.cartItemId}
                item={item}
                onIncrement={() => onIncrement(item.cartItemId)}
                onDecrement={() => onDecrement(item.cartItemId)}
                onRemove={() => onRemove(item.cartItemId)}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
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
