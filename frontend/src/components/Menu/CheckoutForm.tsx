import { useState } from "react";
import { useCart } from "../Menu/CartContext";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { TextField } from "@mui/material";
import "./checkoutForm.css";

const API_URL = import.meta.env.VITE_API_URL;
const NUM_WHATSAPP = import.meta.env.VITE_WHATSAPP;

const formatARS = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value);

interface CheckoutFormProps {
  isOpen: boolean;
}

export const CheckoutForm = ({ isOpen }: CheckoutFormProps) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [type, setType] = useState<"delivery" | "takeaway">("delivery");
  const [payment, setPayment] = useState<"efectivo" | "transferencia">("efectivo");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefono, setTelefono] = useState("");

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleSend = async () => {
    const items = cart
      .map(
        (item) =>
          `- ${item.product.name} x${item.qty} (${formatARS(item.product.price * item.qty)})`
      )
      .join("\n");

    const msg = 
      `Hola, quisiera ${isOpen ? "hacer un pedido" : "programar un pedido"} de sushi:\n\n` +
      `*Pedido:*\n${items}\n\n` +
      `*Total:* ${formatARS(total)}\n` +
      `*Tipo de entrega:* ${type === "delivery" ? "Delivery" : "Take Away"}\n` +
      (type === "delivery" ? `*Dirección:* ${address}\n` : "") +
      `*Método de pago:* ${payment === "efectivo" ? "Efectivo" : "Transferencia"}\n` +
      `*Comentario:* ${comment || "Sin comentarios"}\n` +
      `*Cliente:* ${nombreCliente}\n` +
      `*Teléfono:* ${telefono}`;

    const pedidoPayload = {
      nombreCliente,
      telefono,
      productos: cart.map((item) => ({
        id: item.product.id,
        producto: item.product.name,
        cantidad: item.qty,
        precio: item.product.price,
      })),
      total,
      comentario: comment,
      metodoPago: payment,
      tipoEntrega: type,
      address,
    };

    try {
      const response = await fetch(`${API_URL}/api/pedidos/publico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoPayload),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error en API:", data.message);
        alert("Error al registrar el pedido en el sistema.");
        return;
      }

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
        <div className="closed-warning">
          ⚠️ Nos encontramos cerrados. Podés <strong>programar tu pedido</strong>.
        </div>
      )}

      {cart.length === 0 ? (
        <p className="empty-cart">El carrito está vacío.</p>
      ) : (
        <ul className="checkout-items">
          {cart.map((item) => (
            <li key={item.product.id} className="checkout-item">
              <span>{item.product.name}</span>
              <div className="item-controls">
                <button onClick={() => removeFromCart(item.product.id)} title="Quitar uno">
                  <FiMinus />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => addToCart(item.product)} title="Agregar uno">
                  <FiPlus />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="checkout-total">
        <strong>Total: {formatARS(total)}</strong>
      </p>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
            <TextField
              fullWidth
              label="Dirección"
              placeholder="Ej: Calle 13 entre 24 y 15 927"
              variant="outlined"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
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
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            placeholder="Ej: Joaquin"
            value={nombreCliente}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombreCliente(e.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            placeholder="Ej: 2266456789"
            value={telefono}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Agregar un comentario:</legend>
          <TextField
            fullWidth
            label="Comentario"
            variant="outlined"
            placeholder="Ingresa un comentario"
            multiline
            rows={3}
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
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
