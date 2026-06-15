import { useEffect, useRef } from 'react';

export default function Header({ cartItemCount, onOpenCart, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const searchInputRef = useRef(null);

  const categories = ['Todos', 'Jugos Refrescantes', 'Sándwiches', 'Postres'];

  useEffect(() => {
    const handleKeyDown = (e) => {
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

  return (
    <header className="header-wrapper">
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
            placeholder="Empieza a escribir para buscar..."
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

      <nav className="category-nav">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>
    </header>
  );
}
