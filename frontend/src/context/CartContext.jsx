
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || uuidv4());

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    console.log('CartProvider: Session ID:', sessionId);
    loadCart();
  }, [sessionId]);

  const loadCart = async () => {
    try {
      console.log('CartProvider: Loading cart for session:', sessionId);
      const res = await api.get(`/cart?sessionId=${sessionId}`);
      console.log('CartProvider: Cart loaded:', res.data);
      setCart(res.data || { items: [], total: 0 });
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, metadata = null) => {
    try {
      console.log('CartProvider: Adding to cart:', { productId, quantity, sessionId, metadata });
      await api.post('/cart', { productId, quantity, sessionId, metadata });
      console.log('CartProvider: Added to cart, reloading...');
      await loadCart();
      console.log('CartProvider: Cart after reload:', cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (id, quantity) => {
    await api.put(`/cart/${id}?sessionId=${sessionId}`, { quantity });
    await loadCart();
  };

  const removeFromCart = async (id) => {
    await api.delete(`/cart/${id}?sessionId=${sessionId}`);
    await loadCart();
  };

  const clearCart = async () => {
    await api.delete(`/cart?sessionId=${sessionId}`);
    await loadCart();
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
