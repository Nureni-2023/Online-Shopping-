import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  CheckCircle,
  Search,
  ArrowRight
} from 'lucide-react';

// --- Mock Data ---
const PRODUCTS = [
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, category: "Electronics", rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Minimalist Leather Watch", price: 149.50, category: "Accessories", rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Smart Fitness Tracker", price: 89.99, category: "Electronics", rating: 4.2, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Ergonomic Office Chair", price: 450.00, category: "Furniture", rating: 4.9, image: "https://images.unsplash.com/photo-1505843490701-5be55389658b?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Canvas Travel Backpack", price: 65.00, category: "Accessories", rating: 4.6, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Bluetooth Speaker", price: 120.00, category: "Electronics", rating: 4.4, image: "https://images.unsplash.com/photo-1608156639585-34a0a56ee6c9?auto=format&fit=crop&w=400&q=80" },
  { id: 7, name: "Mechanical Keyboard", price: 159.99, category: "Electronics", rating: 4.7, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=400&q=80" },
  { id: 8, name: "Modern Ceramic Lamp", price: 75.00, category: "Furniture", rating: 4.3, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" },
];

const CATEGORIES = ["All", "Electronics", "Accessories", "Furniture"];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutStep, setCheckoutStep] = useState('browse'); // browse, checkout, success
  const [notification, setNotification] = useState(null);

  // --- Logic ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      (activeCategory === "All" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // --- Components ---
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600 cursor-pointer" onClick={() => setCheckoutStep('browse')}>
          <ShoppingBag className="w-8 h-8" />
          <span>SwiftShop</span>
        </div>
        
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-96">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );

  const CartSidebar = () => (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
      <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Your Cart
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-indigo-600 font-semibold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 leading-tight">{item.name}</h4>
                    <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-indigo-600"><Minus className="w-4 h-4" /></button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-indigo-600"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('checkout'); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CheckoutView = () => (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="text" placeholder="Last Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="border-2 border-indigo-600 p-4 rounded-xl bg-indigo-50 flex items-center gap-3">
              <div className="w-4 h-4 border-4 border-indigo-600 rounded-full" />
              <span className="font-medium">Credit / Debit Card</span>
            </div>
            <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg mt-4" />
          </div>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl h-fit sticky top-24">
          <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} (x{item.qty})</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setCart([]);
              setCheckoutStep('success');
              window.scrollTo(0,0);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold mt-8 transition-all shadow-xl shadow-indigo-100"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="pt-32 pb-20 px-4 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-8">Thank you for your purchase. We've sent a confirmation email with your order details.</p>
      <button 
        onClick={() => setCheckoutStep('browse')}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Back to Shop
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100">
      <Navbar />
      <CartSidebar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {checkoutStep === 'browse' && (
        <main>
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-indigo-50/50 to-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
                  NEW ARRIVALS 2024
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                  Experience Quality <br />
                  <span className="text-indigo-600">Every Day.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                  Upgrade your lifestyle with our curated collection of premium gadgets and home accessories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group">
                    Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white border border-gray-200 hover:border-indigo-600 px-8 py-4 rounded-xl font-bold transition-all">
                    View Lookbook
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-indigo-100/50 rounded-full blur-3xl" />
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" 
                  alt="Hero Product"
                  className="relative rounded-3xl shadow-2xl w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </section>

          {/* Filters & Products */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">Showing {filteredProducts.length} results</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[12px] font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-4 left-4 right-4 bg-white hover:bg-indigo-600 hover:text-white text-gray-900 py-3 rounded-xl font-bold shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Quick Add
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No products found</h3>
                <p className="text-gray-500">Try changing your filters or search terms.</p>
              </div>
            )}
          </section>
        </main>
      )}

      {checkoutStep === 'checkout' && <CheckoutView />}
      {checkoutStep === 'success' && <SuccessView />}

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-6">
              <ShoppingBag className="w-6 h-6" />
              <span>SwiftShop</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Leading the way in digital commerce with the best products and unmatched delivery speeds.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-indigo-600 cursor-pointer">Electronics</li>
              <li className="hover:text-indigo-600 cursor-pointer">Accessories</li>
              <li className="hover:text-indigo-600 cursor-pointer">New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-indigo-600 cursor-pointer">Shipping</li>
              <li className="hover:text-indigo-600 cursor-pointer">Returns</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="bg-white border p-2 rounded-lg text-sm flex-1 outline-none" />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t text-center text-gray-400 text-sm">
          © 2024 SwiftShop Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}