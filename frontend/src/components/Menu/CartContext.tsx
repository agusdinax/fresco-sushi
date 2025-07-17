import React, { createContext, useContext, useState, useRef } from "react";

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
  const lastAddTimestamp = useRef(0);

  const addToCart = (product: Product) => {
    const now = Date.now();

    // Si la última llamada fue hace menos de 300ms, ignorar
    if (now - lastAddTimestamp.current < 300) {
      // Opcional: console.log("Ignorado click rápido");
      return;
    }

    lastAddTimestamp.current = now;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      let newCart;

      if (existingIndex !== -1) {
        newCart = [...prev];
        newCart[existingIndex].qty += 1;
      } else {
        newCart = [...prev, { product, qty: 1 }];
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === productId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        if (updated[existingIndex].qty > 1) {
          updated[existingIndex].qty -= 1;
        } else {
          updated.splice(existingIndex, 1);
        }
        return updated;
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
