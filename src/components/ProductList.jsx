import ProductCard from './ProductCard';

export default function ProductList({ products, onAdd, searchTerm, selectedCategory }) {
  const categories = [
    { id: 'jugos', title: 'Jugos Refrescantes' },
    { id: 'sandwich', title: 'Sándwiches' },
    { id: 'postre', title: 'Postres' }
  ];

  const lowerCaseSearch = searchTerm?.toLowerCase() || '';

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(lowerCaseSearch) ||
    product.description.toLowerCase().includes(lowerCaseSearch)
  );

  const visibleCategories = categories.filter(cat => 
    !selectedCategory || selectedCategory === 'Todos' || cat.title === selectedCategory
  );

  return (
    <div>
      {visibleCategories.map(cat => {
        const catProducts = filteredProducts.filter(p => p.category === cat.id);
        
        // Don't render the category if there are no products in it after filtering
        if (catProducts.length === 0) return null;

        return (
          <div key={cat.id}>
            <h3 className="section-title">{cat.title}</h3>
            <div className="products-grid">
              {catProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={onAdd} 
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
