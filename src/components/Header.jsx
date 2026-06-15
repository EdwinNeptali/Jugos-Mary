import { useEffect, useRef } from 'react';

export default function Header({ cartItemCount, onOpenCart, searchTerm, setSearchTerm }) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keypresses if the user is already typing in an input or textarea
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      // Focus the search input on any alphanumeric key press
      if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="header">
      <h1>
        <span style={{ fontSize: '1.8rem', color: 'var(--secondary-color)' }}>🥤</span> 
        Jugos & Sándwiches
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
    </header>
  );
}
