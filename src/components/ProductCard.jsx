import { useState } from 'react';
import ProductVisual from './ProductVisual';

export default function ProductCard({ product, onAdd, onSelect }) {
  const [hasBerenjena, setHasBerenjena] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariantId ?? '');
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
  const getProductOptions = () => ({
    hasBerenjena,
    ...(selectedVariant && {
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.cartLabel
    })
  });

  const handleAdd = () => {
    onAdd(product, getProductOptions());
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
        onClick={() => onSelect(product, getProductOptions())}
        aria-label={`Ver detalles de ${product.title}`}
      >
        <ProductVisual product={product} />
        <span className="product-visual-zoom" aria-hidden="true">🔍</span>
      </button>

      <h4 className="product-title">{product.title}</h4>
      <p className="product-desc">{product.description}</p>

      <div className="product-price">S/ {product.price.toFixed(2)}</div>

      {product.variants && (
        <div className="product-options product-variant-options" role="radiogroup" aria-label={`Variante de ${product.title}`}>
          {product.variants.map((variant) => (
            <label className={selectedVariantId === variant.id ? 'selected' : ''} key={variant.id}>
              <input
                type="radio"
                name={`variant-${product.id}`}
                value={variant.id}
                checked={selectedVariantId === variant.id}
                onChange={() => setSelectedVariantId(variant.id)}
                aria-label={variant.label === 'Sin fibra' ? 'Sin fibra, piña colada' : variant.label}
              />
              <span>{variant.label}</span>
            </label>
          ))}
        </div>
      )}

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
