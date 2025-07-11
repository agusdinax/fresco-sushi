import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";
import logo from "../../assets/FRESCO.png"; // Asegurate de tener el logo en esa ruta

export const Footer = () => {
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
          href="https://wa.me/5491123456789"
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
