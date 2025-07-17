import { useState, useEffect } from "react";
import { useCart, type Product } from "../Menu/CartContext";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
  onFinalize: () => void;
  stockGeneralActivo: boolean;
}

export const ProductCard = ({ product, onFinalize, stockGeneralActivo }: ProductCardProps) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const item = cart.find((c) => c.product.id === product.id);
  const quantity = item ? item.qty : 0;
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

  const canAddToCart = stockGeneralActivo && product.disponible !== false;

  return (
    <div className="product-card" style={{ opacity: canAddToCart ? 1 : 0.5 }}>
      {product.image ? (
        <img src={product.image} alt={product.name} />
      ) : (
        <div className="no-image-placeholder">Sin imagen</div>
      )}
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <span>
        {new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 0,
        }).format(product.price)}
      </span>

      {quantity === 0 ? (
        <button
           onClick={() => canAddToCart && addToCart(product)}
          disabled={!canAddToCart}
        >
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
            <button
              onClick={() => canAddToCart && addToCart(product)}
              disabled={!canAddToCart}
            >
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
