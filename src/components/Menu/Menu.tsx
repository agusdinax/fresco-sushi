import { useState } from "react";
import { products, categories } from "../../data/menuData";
import { ProductCard } from "./ProductCard";
import { CategorySelector } from "./CategorySelector";
import { CheckoutForm } from "./CheckoutForm";
import "./menu.css";

export const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("combos");
  const [showCheckout, setShowCheckout] = useState(false);

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
              onFinalize={() => setShowCheckout(true)}
            />
          ))}
      </div>

      {/* Slider del formulario */}
      <div className={`checkout-slider ${showCheckout ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setShowCheckout(false)}>
          ×
        </button>
        <CheckoutForm />
      </div>
    </div>
  );
};
