import { useState } from 'react';
import ProductVisual from './ProductVisual';

export default function ProductCard({ product, onAdd, onSelect }) {
  const [hasBerenjena, setHasBerenjena] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariantId ?? '');
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId);
  const displayedPrice = product.price + (hasBerenjena ? 1 : 0);
  const getProductOptions = () => ({
    hasBerenjena,
    ...(selectedVariant && {
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.cartLabel,
      variantImage: selectedVariant.image
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
        className={`product-visual-trigger ${product.category === 'sandwich' ? 'is-sandwich' : ''}`}
        onClick={() => onSelect(product, getProductOptions())}
        aria-label={`Ver detalles de ${product.title}`}
      >
        <ProductVisual product={product} image={selectedVariant?.image ?? product.image} />
        <span className="product-visual-zoom" aria-hidden="true">🔍</span>
      </button>

      <h4 className="product-title">{product.title}</h4>
      <p className="product-desc">{product.description}</p>

      {product.variants && (
        <div
          className={`product-options product-variant-options ${selectedVariantId === product.variants[1]?.id ? 'is-colada' : ''}`}
          role="group"
          aria-label={`Variante de ${product.title}`}
        >
          <span className="product-variant-indicator" aria-hidden="true" />
          {product.variants.map((variant) => (
            <button
              type="button"
              className="product-variant-choice"
              key={variant.id}
              aria-pressed={selectedVariantId === variant.id}
              aria-label={variant.label === 'Sin fibra' ? 'Sin fibra, piña colada' : variant.label}
              onClick={() => setSelectedVariantId(variant.id)}
            >
              {variant.label}
            </button>
          ))}
        </div>
      )}

      {product.allowBerenjena && (
        <div className="product-options product-berenjena-option">
          <label className={hasBerenjena ? 'selected' : ''}>
            <input
              type="checkbox"
              checked={hasBerenjena}
              onChange={(e) => setHasBerenjena(e.target.checked)}
            />
            <span>Berenjena</span>
          </label>
        </div>
      )}

      <div className="product-card-actions">
        <div className="product-price">S/ {displayedPrice.toFixed(2)}</div>
        <button
          type="button"
          className={`add-button ${showAddedMessage ? 'added' : ''}`}
          onClick={handleAdd}
          aria-label={showAddedMessage ? `${product.title} agregado` : `Agregar ${product.title}`}
        >
          <span aria-hidden="true">{showAddedMessage ? '✓' : '+'}</span>
        </button>
      </div>
    </div>
  );
}
