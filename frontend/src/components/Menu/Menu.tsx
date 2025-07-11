// Menu.tsx
import { useState } from "react";
import { products, categories } from "../../data/menuData";
import { ProductCard } from "./ProductCard";
import { CategorySelector } from "./CategorySelector";
import "./menu.css";

interface MenuProps {
  onFinalizePurchase: () => void;
  checkoutOpen: boolean;
}

export const Menu = ({ onFinalizePurchase, checkoutOpen }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState("combos");

  return (
    <div className="menu-container">
      <h2 className="h2menu">🍣MENÚ</h2>

      <CategorySelector
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="product-grid">
        {products
          .filter((p) => p.category === selectedCategory)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFinalize={() => {
                // Solo abre si aún no está abierto
                if (!checkoutOpen) {
                  onFinalizePurchase();

                  // Scroll al carrito
                  setTimeout(() => {
                    document
                      .querySelector(".cart-sidebar")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }
              }}
            />
          ))}
      </div>
    </div>
  );
};
