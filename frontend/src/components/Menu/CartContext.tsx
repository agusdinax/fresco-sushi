import { createContext, useContext, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used within provider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) =>
    setCart((prev) => [...prev, product]);

  const removeFromCart = (id: number) =>
    setCart((prev: Product[]) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index !== -1) {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      }
      return prev;
    });

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};