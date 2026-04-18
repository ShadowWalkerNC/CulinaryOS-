import React, { useState } from 'react';
import { MenuItem, CartItem, Order } from '../types';
import { ShoppingCart, Trash2, Printer } from 'lucide-react';

interface RegisterViewProps {
  menuItems: MenuItem[];
  onProcessOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
}

export function RegisterView({ menuItems, onProcessOrder }: RegisterViewProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(menuItems.map(m => m.category)))];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id);
      if (existing) {
        return prev.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.menuItem.id === itemId) {
        const newQuantity = c.quantity + delta;
        return newQuantity > 0 ? { ...c, quantity: newQuantity } : c;
      }
      return c;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% assumed tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onProcessOrder({
      items: cart,
      total: total
    });
    setCart([]);
  };

  const filteredMenu = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(m => m.category === selectedCategory);

  return (
    <div className="flex h-screen bg-bg-deep text-text-primary">
      {/* Menu Area (Left) */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex justify-between items-center">
          <h1 className="font-serif font-normal text-[28px]">Menu</h1>
          <div className="flex gap-4 text-[11px] uppercase tracking-widest text-text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></div>
              Offline Mode Active
            </div>
            <div className="flex items-center gap-2">
              <Printer size={12} /> Printer Linked
            </div>
          </div>
        </div>

        <div className="px-6 flex space-x-3 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[13px] border transition-colors ${
                selectedCategory === cat 
                  ? 'bg-bg-accent text-accent border-accent' 
                  : 'bg-bg-surface text-text-secondary border-border-subtle cursor-pointer hover:bg-bg-accent hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-bg-surface border border-border-subtle p-4 rounded-2xl flex flex-col gap-2 text-left cursor-pointer hover:border-accent hover:shadow-lg transition-all active:scale-95"
              >
                <span className="font-serif text-[16px] text-text-primary">{item.name}</span>
                <span className="text-[14px] text-accent">${item.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket/Cart Area (Right 340px) */}
      <div className="w-[340px] flex flex-col bg-bg-surface border-l border-border-subtle p-6">
        <div className="border-b border-border-subtle border-dashed pb-5 mb-5 flex justify-between items-start">
          <div>
            <h2 className="font-serif text-[20px] text-text-primary">Current Order</h2>
            <p className="text-[11px] text-text-secondary mt-1 tracking-wider uppercase">Pending Check</p>
          </div>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-text-secondary hover:text-red-400 p-1 cursor-pointer bg-transparent border-none">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1 placeholder:text-text-secondary">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-secondary/50 font-sans text-sm">
              <ShoppingCart size={48} className="mb-4 opacity-50" />
              <p>No items in order</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {cart.map(item => (
                <div key={item.menuItem.id} className="flex justify-between items-center font-sans text-[14px]">
                  <div className="flex flex-col">
                    <span className="text-text-secondary mb-0.5">{item.quantity}x</span>
                    <span className="text-text-primary font-medium">{item.menuItem.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-text-primary">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center space-x-1 bg-bg-deep rounded text-text-primary border border-border-subtle p-1">
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-bg-accent rounded cursor-pointer border-none bg-transparent text-text-primary"
                      >-</button>
                      <button 
                        onClick={() => updateQuantity(item.menuItem.id, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-bg-accent rounded cursor-pointer border-none bg-transparent text-text-primary"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-border-subtle flex flex-col gap-3 mt-4">
          <div className="flex justify-between text-[14px]">
            <span className="text-text-secondary">Subtotal</span>
            <span className="text-text-primary">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-text-secondary">Tax (8%)</span>
            <span className="text-text-primary">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-serif text-[24px] mb-3">
            <span className="text-text-primary">Total</span>
            <span className="text-text-primary">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`p-[18px] rounded-xl font-bold uppercase tracking-widest text-[11px] border-none transition-all ${
              cart.length === 0 
                ? 'bg-bg-accent text-text-secondary cursor-not-allowed' 
                : 'bg-accent text-bg-deep cursor-pointer hover:brightness-110'
            }`}
          >
            CHARGE ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
