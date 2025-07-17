import { useState, useEffect } from "react";
import axios from "axios";
import { ProductCard } from "./ProductCard";
import { CategorySelector } from "./CategorySelector";
import "./menu.css";
import type { Product } from "../Menu/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

interface MenuProps {
  onFinalizePurchase: () => void;
  checkoutOpen: boolean;
}

interface Categoria {
  key: string;
  label: string;
}

export const Menu = ({ onFinalizePurchase, checkoutOpen }: MenuProps) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [stockGeneralActivo, setStockGeneralActivo] = useState<boolean>(true);

  // Cargar productos + categorías desde API
  const fetchProductos = async () => {
    try {
      const res = await axios.get<Product[]>(`${API_URL}/api/productos`);
      setProductos(res.data);

      // Extraer categorías únicas de productos disponibles
      const cats = Array.from(
        new Set(res.data.filter(p => p.disponible !== false).map(p => p.category))
      ).map(c => ({ key: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
      setCategorias(cats);

      // Si no hay categoría seleccionada o la actual no existe, setear la primera
      if (!selectedCategory || !cats.find(c => c.key === selectedCategory)) {
        setSelectedCategory(cats[0]?.key || "");
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Cargar estado de stock general
  const fetchStockGeneral = async () => {
    try {
      const res = await axios.get<{ stockGeneralActivo: boolean }>(
        `${API_URL}/api/productos/configuracion/stock-general`
      );
      setStockGeneralActivo(res.data.stockGeneralActivo);
    } catch (error) {
      console.error("Error al obtener stock general:", error);
      setStockGeneralActivo(false); // si error, asumir false para seguridad
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchStockGeneral();

    const interval = setInterval(() => {
      fetchProductos();
      fetchStockGeneral();
    }, 5 * 60 * 1000); // cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="menu-container">
      <h2 className="h2menu">🍣 MENÚ</h2>

      <CategorySelector
        categories={categorias}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="product-grid">
        {productos
          .filter(
            (p) =>
              p.category === selectedCategory &&
              p.disponible !== false // solo disponibles
          )
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFinalize={() => {
                if (!checkoutOpen) {
                  onFinalizePurchase();
                  setTimeout(() => {
                    document
                      .querySelector(".cart-sidebar")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }
              }}
              stockGeneralActivo={stockGeneralActivo}
            />
          ))}
      </div>

      {!stockGeneralActivo && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          No hay stock general disponible actualmente. No se pueden agregar productos al carrito.
        </p>
      )}
    </div>
  );
};
