import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import type { Product } from "../../data/menuData";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";

export const ProductCard = ({
  product,
  onFinalize,
}: {
  product: Product;
  onFinalize: () => void;
}) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const quantity = cart.filter((p) => p.id === product.id).length;
  const [showFinalize, setShowFinalize] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quantity > 0) {
      timer = setTimeout(() => setShowFinalize(true), 1000);
    } else {
      setShowFinalize(false);
    }
    return () => clearTimeout(timer);
  }, [quantity]);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <span>${product.price}</span>

      {quantity === 0 ? (
        <button onClick={() => addToCart(product)}>
          <FiShoppingCart />
          Agregar al carrito
        </button>
      ) : (
        <>
          <div className="product-card__actions">
            <button onClick={() => removeFromCart(product.id)}>
              <FiMinus />
            </button>
            <span className="product-card__qty">Cantidad: {quantity}</span>
            <button onClick={() => addToCart(product)}>
              <FiPlus />
            </button>
          </div>

          {showFinalize && (
            <button className="finalize-btn delayed" onClick={onFinalize}>
              Finalizar compra
            </button>
          )}
        </>
      )}
    </div>
  );
};
