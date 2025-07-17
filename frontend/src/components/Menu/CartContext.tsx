import React, { createContext, useContext, useState } from "react";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  disponible?: boolean;
}

interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex !== -1) {
        // Ya está, aumentar cantidad
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      } else {
        // Nuevo producto
        return [...prev, { product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.product.id === productId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (updated[existingIndex].qty > 1) {
          updated[existingIndex].qty -= 1;
          return updated;
        } else {
          // Quitar producto si qty = 1
          updated.splice(existingIndex, 1);
          return updated;
        }
      }
      return prev;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
