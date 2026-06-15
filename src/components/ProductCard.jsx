import { useState } from 'react';

export default function ProductCard({ product, onAdd }) {
  const [hasBerenjena, setHasBerenjena] = useState(false);

  const handleAdd = () => {
    onAdd(product, { hasBerenjena });
    setHasBerenjena(false);
  };

  const isJuice = product.category === 'jugos';

  return (
    <div className="product-card">
      {isJuice ? (
        <div className="juice-cup-wrapper">
          <div className="juice-cup" style={{ background: `linear-gradient(to bottom, ${product.color || '#f3f4f6'}, #e5e7eb)` }}>
            <div className="juice-cup-straw"></div>
            <div className="juice-cup-lid"></div>
            <span style={{ position: 'relative', zIndex: 3 }}>{product.icon}</span>
          </div>
        </div>
      ) : (
        <div className="food-icon-wrapper">
          {product.icon}
        </div>
      )}

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

      <button className="add-button" onClick={handleAdd}>
        Agregar
      </button>
    </div>
  );
}
