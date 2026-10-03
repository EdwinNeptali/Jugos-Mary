import { useState } from 'react';
import ProductVisual from './ProductVisual';

export default function ProductCard({ product, onAdd, onSelect }) {
  const [hasBerenjena, setHasBerenjena] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleAdd = () => {
    onAdd(product, { hasBerenjena });
    setHasBerenjena(false);
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 600);
  };

  return (
    <div className="product-card">
      <button
        type="button"
        className="product-visual-trigger"
        onClick={() => onSelect(product, hasBerenjena)}
        aria-label={`Ver detalles de ${product.title}`}
      >
        <ProductVisual product={product} hasBerenjena={hasBerenjena} />
        <span className="product-visual-zoom" aria-hidden="true">🔍</span>
      </button>

      <h4 className="product-title">{product.title}</h4>
      <p className="product-desc">{product.description}</p>

      <div className="product-price">S/ {product.price.toFixed(2)}</div>

      {product.allowBerenjena && (
        <div className="product-options">
          <label>
            <input
              type="checkbox"
              checked={hasBerenjena}
              onChange={(e) => setHasBerenjena(e.target.checked)}
            />
            <span>+ Berenjena (S/ 1.00)</span>
          </label>
        </div>
      )}

      <button
        className={`add-button ${showAddedMessage ? 'added' : ''}`}
        onClick={handleAdd}
      >
        {showAddedMessage ? '¡Agregado!' : 'Agregar'}
      </button>
    </div>
  );
}
