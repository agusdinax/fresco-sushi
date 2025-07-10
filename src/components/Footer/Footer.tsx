import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/FRESCO.png";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-socials">
        <a
          href="https://instagram.com/tuusuario"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://wa.me/549XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>
      </div>

      <div className="footer-logo">
        <img src={logo} alt="Logo del emprendimiento" />
      </div>

      <div className="footer-location">
        <p>📍 Balcarce, Buenos Aires, Argentina</p>
      </div>
    </footer>
  );
};
