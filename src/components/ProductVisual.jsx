export default function ProductVisual({ product, hasBerenjena, large }) {
  const sizeClass = large ? 'large' : '';

  if (product.category === 'jugos') {
    return (
      <div className={`juice-cup-wrapper ${sizeClass}`}>
        <div className="juice-straw"></div>
        <div
          className="juice-glass"
          style={{ background: `linear-gradient(165deg, ${product.color} 0%, ${product.color} 55%, rgba(0,0,0,0.08) 100%)` }}
        >
          <span className="juice-fiber"></span>
          {hasBerenjena && <span className="juice-seeds"></span>}
          <span className="juice-surface"></span>
          <span className="juice-icon">{product.icon}</span>
        </div>
        <div className="juice-glass-foot"></div>
      </div>
    );
  }

  if (product.category === 'sandwich') {
    return (
      <div className={`bread-wrapper ${sizeClass}`}>
        <div className="bread-roll">
          <span className="bread-filling-icon">{product.icon}</span>
        </div>
      </div>
    );
  }

  if (product.category === 'postre') {
    return (
      <div className={`cake-wrapper ${sizeClass}`}>
        <div className="cake-round">
          <div className="cake-slice"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="food-icon-wrapper">
      {product.icon}
    </div>
  );
}
