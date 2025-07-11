import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../HeaderGallery/HeaderGallery.css";

const slides = [
  {
    img: "src/assets/header1.jpg",
    title: "— FRESCO —",
    subtitle: "Sushi de autor para eventos, delivery y take away en la ciudad de Balcarce.",
  },
  {
    img: "src/assets/header2.jpg",
    title: "Opciones para todos los gustos",
    subtitle: "Consultá por piezas sin TACC, vegetarianas y veganas.",
  },
  {
    img: "src/assets/header3.jpg",
    title: "Viví la experiencia FRESCO",
    subtitle: "Frescura, sabor y presentación pensados para compartir.",
  }
];

export const HeaderGallery: React.FC = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <header className="header-gallery" id="header">
      {slides.map(({ img, title, subtitle }, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        >
          {/* Capa difuminada */}
          <div className="slide-overlay" />

          {/* Contenido centrado */}
          <div className="slide-content">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      ))}

      {/* Controles */}
      <button className="nav-btn left" onClick={prev} aria-label="Anterior">
        <ChevronLeft size={30} />
      </button>
      <button className="nav-btn right" onClick={next} aria-label="Siguiente">
        <ChevronRight size={30} />
      </button>
    </header>
  );
};
