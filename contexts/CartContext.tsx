"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Participant {
  fullName: string;
  email: string;
  phoneNumber: string;
  tshirtSize: string;
}

interface CartItem {
  id: string;
  category: string;
  participant: Participant;
  includeTshirt: boolean;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('raceCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('raceCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('raceCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if item already exists (by participant email and category)
      const existingIndex = prev.findIndex(
        cartItem => 
          cartItem.participant.email === item.participant.email && 
          cartItem.category === item.category
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = { ...item, id: prev[existingIndex].id };
        return updated;
      } else {
        // Add new item
        return [...prev, { ...item, id: item.id || Date.now().toString() }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('raceCart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const isInCart = (id: string) => {
    return cartItems.some(item => item.id === id);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 