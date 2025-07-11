// src/components/EventoCard.tsx
import "./EventoCard.css";

interface EventoCardProps {
  image: string;
  title: string;
  text: string;
}

export default function EventoCard({ image, title, text }: EventoCardProps) {
  return (
    <div className="evento-card" id="eventos">
      <div className="evento-info">
        <h3 className="evento-title">{title}</h3>
        <p className="evento-text">{text}</p>
      </div>
      <img src={image} alt="Evento sushi" className="evento-img" />
    </div>
  );
}
