import { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import { products } from './data/products';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product, options) => {
    setCart((prev) => {
      // Create a unique key based on product id and options (e.g. hasBerenjena)
      const cartItemId = `${product.id}-${options?.hasBerenjena ? 'b' : 'n'}`;
      const existingItem = prev.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Calculate final price based on options
      let finalPrice = product.price;
      if (options?.hasBerenjena) {
        finalPrice += 1;
      }

      return [...prev, { 
        ...product, 
        cartItemId, 
        quantity: 1, 
        finalPrice, 
        options 
      }];
    });
    
    // Open cart automatically when adding
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: Math.max(0, newQuantity) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header 
        cartItemCount={cartItemCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <main>
        <div className="container">
          <ProductList products={products} onAdd={addToCart} searchTerm={searchTerm} />
        </div>
      </main>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        total={cartTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal 
          cart={cart}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
}

export default App;
