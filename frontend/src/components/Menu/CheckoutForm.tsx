import { useState } from "react";
import { useCart } from "./CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./checkoutForm.css";
const API_URL = import.meta.env.VITE_API_URL;
const NUM_WHATSAPP = import.meta.env.VITE_WHATSAPP;

interface CheckoutFormProps {
  isOpen: boolean;
}

export const CheckoutForm = ({ isOpen }: CheckoutFormProps) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [type, setType] = useState("delivery");
  const [payment, setPayment] = useState("efectivo");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefono, setTelefono] = useState("");

  // Agrupar productos
  const grouped = cart.reduce((acc, item) => {
    acc[item.id] = acc[item.id]
      ? { ...acc[item.id], qty: acc[item.id].qty + 1 }
      : { ...item, qty: 1 };
    return acc;
  }, {} as Record<number, (typeof cart)[number] & { qty: number }>);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const handleSend = async () => {
    const items = Object.values(grouped)
      .map(p => `- ${p.name} x${p.qty} ($${p.price * p.qty})`)
      .join("\n");

    const msg =
      `Hola, quisiera ${isOpen ? "hacer un pedido" : "programar un pedido"} de sushi:\n\n` +
      `*Pedido:*\n${items}\n\n` +
      `*Total:* $${total}\n` +
      `*Tipo de entrega:* ${type === "delivery" ? "Delivery" : "Take Away"}\n` +
      (type === "delivery" ? `*Dirección:* ${address}\n` : "") +
      `*Método de pago:* ${payment === "efectivo" ? "Efectivo" : "Transferencia"}\n` +
      `*Comentario:* ${comment || "Sin comentarios"}\n` +
      `*Cliente:* ${nombreCliente}\n` +
      `*Teléfono:* ${telefono}`;

    const pedidoPayload = {
      nombreCliente,
      telefono,
      productos: Object.values(grouped).map(p => ({
        id: p.id,
        producto: p.name,
        cantidad: p.qty,
        precio: p.price,
      })),
      total,
      metodoPago: payment,
      tipoEntrega: type,
      address
    };

    try {
      const response = await fetch(`${API_URL}/api/pedidos/publico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoPayload),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error en API:", data.message);
        alert("Error al registrar el pedido en el sistema.");
        return;
      }

      // Abrir WhatsApp
      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://wa.me/${NUM_WHATSAPP}?text=${encodedMsg}`, "_blank");
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="checkout-form">
      <h3>🛒 Mi pedido</h3>

      {!isOpen && (
        <div className="closed-warning" style={{ marginBottom: "1rem", color: "red" }}>
          ⚠️ Nos encontramos cerrados. Podés <strong>programar tu pedido</strong>.
        </div>
      )}

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
    if (!nombreCliente || !telefono) {
      alert("Por favor completá tu nombre y teléfono.");
      return;
    }
    handleSend();
  }}
>
  <fieldset>
    <legend>Tipo de entrega:</legend>
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
    <fieldset>
      <legend>Dirección para entrega:</legend>
      <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
    </fieldset>
  )}

  <fieldset>
    <legend>Método de pago:</legend>
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

  <fieldset>
    <legend>Datos del cliente:</legend>
    <label>
      Nombre:
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombreCliente}
        onChange={(e) => setNombreCliente(e.target.value)}
        required
      />
    </label>
  </fieldset>
  <fieldset>
    <label>
      Teléfono:
      <input
        type="text"
        placeholder="Tu teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />
    </label>
  </fieldset>

  <fieldset>
    <legend>Agregar un comentario:</legend>
    <textarea
      placeholder="Comentario"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
  </fieldset>

  <button type="submit" disabled={cart.length === 0}>
    <FaWhatsapp className="whatsapp-icon1" />
    {isOpen ? "Enviar pedido por WhatsApp" : "Programar pedido"}
   </button>
    </form>
    </div>
  );
};
