import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";
import logo from "../../assets/FRESCO.png"; // Asegurate de tener el logo en esa ruta
const NUM_WHATSAPP = import.meta.env.VITE_WHATSAPP;

export const Footer = () => {
  const mensaje = "¡Hola! Quiero hacer un pedido.";
  const linkWhatsapp = `https://wa.me/${NUM_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  return (
    <footer className="footer">
      <div className="footer-left">
        <a
          href="https://www.instagram.com/frescosushi/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram className="footer-icon" />
        </a>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="footer-icon" />
        </a>
      </div>

        <a href="#header" className="footer-center">
          <img src={logo} alt="Logo del emprendimiento" className="footer-logo" />
        </a>

      <div className="footer-right">
        <p className="footer-location">📍 Balcarce, Buenos Aires, Argentina</p>
      </div>
    </footer>
  );
};
