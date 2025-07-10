import { Navbar } from "./components/Navbar/Navbar";
import { HeaderGallery } from "./components/HeaderGallery/HeaderGallery";
import HorariosFresco from "./components/HorariosFresco/HorariosFresco";
import SushimanCard from "./components/SushimanCard/SushimanCard";
import EventoCard from "./components/EventoCard/EventoCard";
import { Menu } from "./components/Menu/Menu";
import { CartProvider } from "./components/Menu/CartContext";
import { CheckoutForm } from "./components/Menu/CheckoutForm";
import { useState } from "react";
import { GalleryCarousel } from "./components/GalleryCarousel/GalleryCarousel";
import { ContactForm } from "./components/ContactForm/ContactForm";
import { Footer } from "./components/Footer/Footer";

const images = [
  { src: "src/assets/header1.jpg", alt: "Sushi variado en bandeja" },
  { src: "src/assets/header2.jpg", alt: "Chef preparando sushi" },
  { src: "src/assets/header3.jpg", alt: "Combo fresco de sushi" },
  { src: "src/assets/header1.jpg", alt: "Sashimi y makis" },
  { src: "src/assets/header2.jpg", alt: "Rolls de salmón y palta" },
];

export const App = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const toggleCheckout = () => {
    setCheckoutOpen(prev => !prev);
  };

 return (
    <CartProvider>
      <div className="app-container header" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar onToggleCheckout={toggleCheckout} isCheckoutOpen={checkoutOpen} />
        <HeaderGallery />
        <HorariosFresco />
        <main style={{ flex: 1 }}>
          <Menu />

          <SushimanCard
            image="src/assets/HEADE.jpg"
            name="Nuestro Sushiman"
            description="Con años de experiencia, crea piezas únicas para cada evento. Pasión, técnica y frescura en cada bocado."
          />

          <EventoCard
            image="src/assets/evento.jpg"
            title="Sushi para tus eventos"
            text="Hacé tu evento inolvidable con nuestro sushi personalizado. Consultanos por opciones sin TACC, veganas y más."
          />
          <GalleryCarousel images={images} title="Nuestros platos destacados" />
          <ContactForm />
        </main>
        <Footer/>
        {/* Sidebar del carrito */}
        <div className={`cart-sidebar ${checkoutOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={toggleCheckout}>×</button>
          <CheckoutForm />
        </div>
      </div>
    </CartProvider>
  );
};

export default App;
