import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/FRESCO.png";
import "./Navbar.css";
import { useCart } from "../Menu/CartContext";

interface NavbarProps {
  onToggleCheckout: () => void;
  isCheckoutOpen: boolean;
}

export const Navbar = ({ onToggleCheckout, isCheckoutOpen }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.length;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__left">
          <a href="#header">
            <img src={logo} alt="Logo Fresco" className="navbar__logo" />
          </a>
        </div>

        <div className={`navbar__links ${menuOpen ? "active" : ""}`}>
          <a href="#header">MENÚ</a>
          <a href="#sushiman">SUSHIMAN</a>
          <a href="#eventos">EVENTOS</a>
          <a href="#galeria">GALERÍA</a>
          <a href="#contacto">CONTACTO</a>
        </div>

        <div className="navbar__right">
          <div
            className="navbar__cart"
            onClick={onToggleCheckout}
            style={{ cursor: "pointer", position: "relative" }}
            title={isCheckoutOpen ? "Cerrar carrito" : "Abrir carrito"}
          >
            <ShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>

          <button className="navbar__toggle" onClick={toggleMenu}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <a
        href="https://wa.me/5492266631510?text=¡Hola!%20Quiero%20hacer%20un%20pedido."
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="whatsapp-icon" />
      </a>
    </>
  );
};
