import { useRef } from 'react';

export default function ProductVisual({ product, hasBerenjena, large }) {
  const sizeClass = large ? 'large' : '';
  const visualRef = useRef(null);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);
  const transformRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });

  const applyTransform = (transform) => {
    transformRef.current = transform;
    if (visualRef.current) {
      visualRef.current.style.transform =
        `perspective(700px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`;
    }
  };

  const resetTransform = () => {
    pointersRef.current.clear();
    gestureRef.current = null;
    visualRef.current?.parentElement?.classList.remove('is-manipulating');
    applyTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const handlePointerDown = (event) => {
    if (!large || event.target.closest('button')) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add('is-manipulating');
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const points = Array.from(pointersRef.current.values());
    if (points.length === 1) {
      gestureRef.current = {
        type: 'rotate',
        x: event.clientX,
        y: event.clientY,
        ...transformRef.current
      };
    } else if (points.length === 2) {
      const [first, second] = points;
      gestureRef.current = {
        type: 'zoom',
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale: transformRef.current.scale
      };
    }
  };

  const handlePointerMove = (event) => {
    const gesture = gestureRef.current;
    if (!gesture || !pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (gesture.type === 'rotate') {
      applyTransform({
        rotateX: Math.max(-16, Math.min(16, gesture.rotateX - (event.clientY - gesture.y) * 0.35)),
        rotateY: Math.max(-42, Math.min(42, gesture.rotateY + (event.clientX - gesture.x) * 0.55)),
        scale: gesture.scale
      });
      return;
    }

    const points = Array.from(pointersRef.current.values());
    if (points.length < 2) return;
    const [first, second] = points;
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    applyTransform({
      ...transformRef.current,
      scale: Math.max(1, Math.min(2.2, gesture.scale * distance / Math.max(gesture.distance, 1)))
    });
  };

  const handlePointerUp = (event) => {
    if (event.target.closest('button')) return;
    resetTransform();
  };

  if (product.category === 'jugos') {
    const liquidPath = 'M47 43 C65 39 115 39 134 44 L131 59 C126 101 122 151 116 178 Q112 195 97 200 Q80 198 72 183 C63 151 53 97 47 43Z';

    return (
      <div
        className={`juice-cup-wrapper juice-glass-stage ${sizeClass}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetTransform}
        onLostPointerCapture={resetTransform}
        role={large ? 'group' : undefined}
        aria-label={large ? 'Arrastra para girar el vaso; pellizca para acercar. Al soltar vuelve a la vista original.' : undefined}
      >
        <svg
          ref={visualRef}
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
          {hasBerenjena && (
            <g>
              <path
                d={liquidPath}
                fill="#63371f"
                opacity=".12"
                style={{ mixBlendMode: 'multiply' }}
              />
              <g fill="#49301f" opacity=".88">
                <ellipse cx="64" cy="82" rx="1.1" ry="1.8" />
                <ellipse cx="91" cy="97" rx="1.3" ry="1.9" />
                <ellipse cx="118" cy="87" rx="1.2" ry="1.8" />
                <ellipse cx="77" cy="126" rx="1.2" ry="1.8" />
                <ellipse cx="108" cy="139" rx="1.3" ry="2" />
                <ellipse cx="91" cy="162" rx="1.2" ry="1.8" />
                <ellipse cx="119" cy="166" rx="1.1" ry="1.7" />
                <ellipse cx="70" cy="156" rx="1.1" ry="1.7" />
              </g>
            </g>
          )}
        </svg>

        {large && (
          <>
            <span className="juice-gesture-hint">Arrastra para girar · Pellizca para acercar</span>
            <div className="juice-zoom-controls" aria-label="Controles de acercamiento">
              <button
                type="button"
                aria-label="Acercar vaso"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => applyTransform({ ...transformRef.current, scale: Math.min(2.2, transformRef.current.scale + 0.25) })}
              >+</button>
              <button
                type="button"
                aria-label="Alejar vaso"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => applyTransform({ ...transformRef.current, scale: Math.max(1, transformRef.current.scale - 0.25) })}
              >−</button>
              <button
                type="button"
                aria-label="Restablecer vista del vaso"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => applyTransform({ rotateX: 0, rotateY: 0, scale: 1 })}
              >↺</button>
            </div>
          </>
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
