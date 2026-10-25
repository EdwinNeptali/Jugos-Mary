import { lazy, Suspense } from 'react';

const JuiceGlass3D = lazy(() => import('./JuiceGlass3D'));

export default function ProductVisual({ product, hasBerenjena, large }) {
  const sizeClass = large ? 'large' : '';

  if (product.category === 'jugos') {
    const liquidPath = 'M47 43 C65 39 115 39 134 44 L131 59 C126 101 122 151 116 178 Q112 195 97 200 Q80 198 72 183 C63 151 53 97 47 43Z';

    return (
      <div className={`juice-cup-wrapper juice-glass-stage ${sizeClass}`}>
        {large ? (
          <Suspense fallback={<img className="juice-glass-3d-fallback" src={product.image} alt={`Vaso de ${product.title}`} />}>
            <JuiceGlass3D product={product} hasBerenjena={hasBerenjena} />
          </Suspense>
        ) : (
          <svg
            className={`juice-glass-illustration ${hasBerenjena ? 'with-eggplant' : ''}`}
            viewBox="39 27 104 212"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Foto del vaso real de ${product.title}, sin popote ni fondo`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <image href={product.image} width="194" height="259" preserveAspectRatio="none" />
            {product.tintColor && (
              <path
                d={liquidPath}
                fill={product.tintColor}
                opacity={product.tintOpacity}
                style={{ mixBlendMode: product.tintBlendMode }}
              />
            )}
          </svg>
        )}
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
