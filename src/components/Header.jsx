import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CATEGORY_SECTION_IDS = {
  Jugos: 'jugos',
  Sandwichs: 'sandwich',
  Postres: 'postre'
};

export default function Header({ cartItemCount, onOpenCart, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const searchInputRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const buttonRefs = useRef({});

  const [isHidden, setIsHidden] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const categories = ['Jugos', 'Sandwichs', 'Postres'];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cart/checkout panel is open: never steal focus into a hidden header input.
      if (document.body.classList.contains('body-scroll-locked')) {
        return;
      }

      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide header on scroll-down, reveal it on scroll-up (never while the
  // user is actively focused inside it, e.g. typing in search).
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        const pastThreshold = currentY > 140;
        const focusInsideHeader = headerRef.current?.contains(document.activeElement);

        if (!focusInsideHeader) {
          if (delta > 4 && pastThreshold) {
            setIsHidden(true);
          } else if (delta < -4 || !pastThreshold) {
            setIsHidden(false);
          }
        }

        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const measureIndicator = () => {
    const activeBtn = buttonRefs.current[selectedCategory];
    const nav = navRef.current;
    if (!activeBtn || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - navRect.left + nav.scrollLeft,
      width: btnRect.width,
      opacity: 1
    });
  };

  useLayoutEffect(measureIndicator, [selectedCategory]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    const section = document.getElementById(`section-${CATEGORY_SECTION_IDS[cat]}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header ref={headerRef} className={`header-wrapper ${isHidden ? 'header-hidden' : ''}`}>
      <div className="header-main">
        <h1>
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--secondary-color)' }}>🥤</span>
            Jugos Mary
          </a>
        </h1>

        <div className="search-bar-container">
          <input
            ref={searchInputRef}
            type="text"
            className="global-search-input"
            placeholder="¿Qué quieres comer hoy?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="cart-button" onClick={onOpenCart}>
          🛒 Mi Pedido
          {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
        </button>
      </div>

      <nav className="category-nav" ref={navRef}>
        {categories.map(cat => (
          <button
            key={cat}
            ref={(el) => { buttonRefs.current[cat] = el; }}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
        <span
          className="category-indicator"
          style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px`, opacity: indicator.opacity }}
        ></span>
      </nav>
    </header>
  );
}
