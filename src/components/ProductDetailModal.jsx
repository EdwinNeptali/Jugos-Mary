import { useEffect } from 'react';
import './ProductDetailModal.css';
import ProductVisual from './ProductVisual';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function ProductDetailModal({ product, hasBerenjena, onClose }) {
  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const bullets = [];
  if (product.prep) bullets.push({ icon: '👨‍🍳', text: product.prep });
  (product.benefits || []).forEach((b) => bullets.push({ icon: '✔️', text: b }));
  if (hasBerenjena && product.berenjenaBenefit) {
    bullets.push({ icon: '🍆', text: product.berenjenaBenefit });
  }
  if (product.volume) bullets.push({ icon: '🥤', text: `Contiene ${product.volume}` });

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div
        className="detail-content"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close" onClick={onClose} aria-label="Cerrar">×</button>

        <div className="detail-visual-stage">
          <ProductVisual product={product} hasBerenjena={hasBerenjena} large />
        </div>

        <h2 className="detail-title">{product.title}</h2>
        <div className="detail-price">S/ {product.price.toFixed(2)}</div>

        <ul className="detail-bullets">
          {bullets.map((bullet, i) => (
            <li key={i}>
              <span className="detail-bullet-icon">{bullet.icon}</span>
              <span>{bullet.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
