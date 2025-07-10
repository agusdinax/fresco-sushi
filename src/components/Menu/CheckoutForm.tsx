import { useState } from "react";
import { useCart } from "./CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./checkoutForm.css";

export const CheckoutForm = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [type, setType] = useState("delivery");
  const [payment, setPayment] = useState("efectivo");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  // Agrupar productos para mostrar cantidad
  const grouped = cart.reduce((acc, item) => {
    acc[item.id] = acc[item.id]
      ? { ...acc[item.id], qty: acc[item.id].qty + 1 }
      : { ...item, qty: 1 };
    return acc;
  }, {} as Record<number, (typeof cart)[number] & { qty: number }>);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const handleSend = () => {
    const items = Object.values(grouped)
      .map(p => `- ${p.name} x${p.qty} ($${p.price * p.qty})`)
      .join("\n");

    // Construimos el mensaje con emojis y saltos de línea
    let msg = `👋 Hola, quisiera hacer un pedido de sushi:\n\n` +
      `🍣 *Pedido:*\n${items}\n\n` +
      `💰 *Total:* $${total}\n` +
      `🚚 *Tipo de entrega:* ${type === "delivery" ? "Delivery" : "Take Away"}\n` +
      (type === "delivery" ? `🏠 *Dirección:* ${address}\n` : "") +
      `💳 *Método de pago:* ${payment === "efectivo" ? "Efectivo" : "Transferencia"}`;

    if (comment.trim() !== "") {
      msg += `\n📝 *Comentario:* ${comment}`;
    }

    // Codificamos el mensaje para URL
    const encodedMsg = encodeURIComponent(msg);

    window.open(`https://wa.me/5492494381315?text=${encodedMsg}`, "_blank");
  };

  return (
    <div className="checkout-form">
      <h3>🛒 Mi pedido</h3>

      {cart.length === 0 ? (
        <p className="empty-cart">El carrito está vacío.</p>
      ) : (
        <ul className="checkout-items">
          {Object.values(grouped).map(item => (
            <li key={item.id} className="checkout-item">
              <span>{item.name}</span>
              <div className="item-controls">
                <button onClick={() => removeFromCart(item.id)} title="Quitar uno">
                  <FiMinus />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => addToCart(item)} title="Agregar uno">
                  <FiPlus />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="checkout-total"><strong>Total: ${total}</strong></p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <fieldset>
          <legend>Tipo de entrega</legend>
          <label>
            <input
              type="radio"
              name="type"
              value="delivery"
              checked={type === "delivery"}
              onChange={() => setType("delivery")}
            />
            Delivery
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="takeaway"
              checked={type === "takeaway"}
              onChange={() => setType("takeaway")}
            />
            Take Away
          </label>
        </fieldset>

        {type === "delivery" && (
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        )}

        <fieldset>
          <legend>Método de pago</legend>
          <label>
            <input
              type="radio"
              name="payment"
              value="efectivo"
              checked={payment === "efectivo"}
              onChange={() => setPayment("efectivo")}
            />
            Efectivo
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="transferencia"
              checked={payment === "transferencia"}
              onChange={() => setPayment("transferencia")}
            />
            Transferencia
          </label>
        </fieldset>

        <textarea
          placeholder="Comentario"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <button type="submit" disabled={cart.length === 0}>
          <FaWhatsapp className="whatsapp-icon1" />
          Enviar pedido por WhatsApp
        </button>
      </form>
    </div>
  );
};
