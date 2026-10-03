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

  const infoRows = [];
  if (hasBerenjena && product.berenjenaBenefit) {
    infoRows.push({ icon: '🍆', text: product.berenjenaBenefit });
  }
  if (product.volume) {
    infoRows.push({ icon: '🥤', text: `Contiene ${product.volume}` });
  }

  const glowColor = product.category === 'jugos' ? product.color : '#e3b56c';

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
          <div className="detail-visual-glow" style={{ background: glowColor }}></div>
          <ProductVisual product={product} hasBerenjena={hasBerenjena} large />
        </div>

        <h2 className="detail-title">{product.title}</h2>
        <div className="detail-price">S/ {product.price.toFixed(2)}</div>

        {product.prep && <p className="detail-prep">{product.prep}</p>}

        {product.benefits?.length > 0 && (
          <div className="detail-chips">
            {product.benefits.map((benefit, i) => (
              <span className="detail-chip" key={i}>✓ {benefit}</span>
            ))}
          </div>
        )}

        {infoRows.length > 0 && (
          <div className="detail-info-list">
            {infoRows.map((row, i) => (
              <div className="detail-info-row" key={i}>
                <span className="detail-info-icon">{row.icon}</span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
