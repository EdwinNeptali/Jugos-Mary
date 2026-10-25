import { useRef, useState } from 'react';

export default function ProductVisual({ product, large }) {
  const sizeClass = large ? 'large' : '';
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const touchGestureRef = useRef(null);

  if (product.category === 'jugos') {
    const updateZoomOrigin = (event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
      setZoomOrigin(`${x}% ${y}%`);
    };

    const handlePointerEnter = (event) => {
      if (large && event.pointerType === 'mouse') {
        updateZoomOrigin(event);
        setIsZoomed(true);
      }
    };

    const handlePointerMove = (event) => {
      if (large && (event.pointerType === 'mouse' || touchGestureRef.current?.startedZoomed)) {
        updateZoomOrigin(event);
        if (event.pointerType === 'touch' && touchGestureRef.current) {
          const deltaX = event.clientX - touchGestureRef.current.startX;
          const deltaY = event.clientY - touchGestureRef.current.startY;
          if (Math.hypot(deltaX, deltaY) > 5) touchGestureRef.current.moved = true;
        }
      }
    };

    const handlePointerLeave = (event) => {
      if (event.pointerType === 'mouse') setIsZoomed(false);
    };

    const handlePointerDown = (event) => {
      if (large && event.pointerType === 'touch') {
        updateZoomOrigin(event);
        touchGestureRef.current = {
          startX: event.clientX,
          startY: event.clientY,
          startedZoomed: isZoomed,
          moved: false
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    };

    const handlePointerUp = (event) => {
      if (event.pointerType === 'touch' && touchGestureRef.current) {
        const gesture = touchGestureRef.current;
        if (!gesture.moved) {
          updateZoomOrigin(event);
          setIsZoomed(!gesture.startedZoomed);
        }
        touchGestureRef.current = null;
      }
    };

    const handlePointerCancel = () => {
      touchGestureRef.current = null;
    };

    return (
      <div
        className={`juice-cup-wrapper juice-glass-stage ${sizeClass} ${isZoomed ? 'is-zoomed' : ''}`}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <img
          className={`juice-glass-image ${isZoomed ? 'is-zoomed' : ''}`}
          src={product.image}
          alt={`Vaso de ${product.title}`}
          draggable="false"
          style={large ? { transformOrigin: zoomOrigin } : undefined}
        />
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
