import { Navbar } from "./components/Navbar/Navbar";
import { HeaderGallery } from "./components/HeaderGallery/HeaderGallery";
import HorariosFresco from "./components/HorariosFresco/HorariosFresco";
import SushimanCard from "./components/SushimanCard/SushimanCard";
import EventoCard from "./components/EventoCard/EventoCard";
import { Menu } from "./components/Menu/Menu";
import { CartProvider } from "./components/Menu/CartContext";
import { CheckoutForm } from "./components/Menu/CheckoutForm";
import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleCheckout = () => {
    setCheckoutOpen(prev => !prev);
  };

  useEffect(() => {
      type Day = "miércoles" | "jueves" | "viernes" | "sábado" | "domingo";

      const SCHEDULE: Record<Day, [string, string][]> = {
        miércoles: [["19:00", "00:00"]],
        jueves: [["19:00", "00:00"]],
        viernes: [["19:00", "00:00"]],
        sábado: [["19:00", "00:00"]],
        domingo: [["19:00", "00:00"]],
      };

      const hhmmToDate = (base: Date, hhmm: string) => {
        const [h, m] = hhmm.split(":").map(Number);
        const d = new Date(base);
        d.setHours(h, m, 0, 0);
        return d;
      };

      const nowBetween = ([start, end]: [string, string], now: Date) => {
        const ini = hhmmToDate(now, start);
        const fin = hhmmToDate(now, end);
        if (fin < ini) fin.setDate(fin.getDate() + 1);
        return now >= ini && now <= fin;
      };

      const checkOpen = () => {
        const now = new Date();
        const today = now.toLocaleDateString("es-AR", { weekday: "long" }) as Day;
        const daySchedule = SCHEDULE[today];
        if (!daySchedule) {
          setIsOpen(false);
          return;
        }
        const openNow = daySchedule.some((range: [string, string]) => nowBetween(range, now));
        setIsOpen(openNow);
      };

      checkOpen();
      const interval = setInterval(checkOpen, 60000);
      return () => clearInterval(interval);
    }, []);

 return (
    <CartProvider>
      <div className="app-container header" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar onToggleCheckout={toggleCheckout} isCheckoutOpen={checkoutOpen} />
        <HeaderGallery />
        <HorariosFresco isOpen={isOpen} />
        <main style={{ flex: 1 }}>
          <div id="menu">
            <Menu onFinalizePurchase={toggleCheckout} checkoutOpen={checkoutOpen} />
          </div>

          <SushimanCard
            image="src/assets/sushiman.jpg"
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
            <CheckoutForm isOpen={isOpen} />
          </div>
      </div>
    </CartProvider>
  );
};

export default App;
