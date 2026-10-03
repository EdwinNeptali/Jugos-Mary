import { useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onAdd, onSelect, searchTerm, onActiveCategoryChange }) {
  const categories = [
    { id: 'jugos', title: 'Jugos' },
    { id: 'sandwich', title: 'Sandwichs' },
    { id: 'postre', title: 'Postres' }
  ];

  const lowerCaseSearch = searchTerm?.toLowerCase() || '';

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(lowerCaseSearch) ||
    product.description.toLowerCase().includes(lowerCaseSearch)
  );

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-category-section]'));
    if (sections.length === 0) return;

    // A short last section can never reach the observer's "active" band
    // once the page runs out of room to scroll further, so both the
    // observer and the scroll fallback below check this the same way —
    // whichever fires last must still land on the same answer.
    const isAtBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAtBottom()) {
          onActiveCategoryChange?.(sections[sections.length - 1].getAttribute('data-category-title'));
          return;
        }

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        onActiveCategoryChange?.(topMost.target.getAttribute('data-category-title'));
      },
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (isAtBottom()) {
          onActiveCategoryChange?.(sections[sections.length - 1].getAttribute('data-category-title'));
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchTerm, onActiveCategoryChange]);

  return (
    <div>
      {categories.map(cat => {
        const catProducts = filteredProducts.filter(p => p.category === cat.id);

        // Don't render the category if there are no products in it after filtering
        if (catProducts.length === 0) return null;

        return (
          <div
            key={cat.id}
            id={`section-${cat.id}`}
            className="category-section"
            data-category-section
            data-category-title={cat.title}
          >
            <h3 className="section-title">{cat.title}</h3>
            <div className="products-grid">
              {catProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <p>No se encontraron productos que coincidan con "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}
