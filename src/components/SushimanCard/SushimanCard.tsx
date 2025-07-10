// src/components/SushimanCard.tsx
import "./SushimanCard.css";

interface SushimanCardProps {
  image: string;
  name: string;
  description: string;
}

export default function SushimanCard({ image, name, description }: SushimanCardProps) {
  return (
    <div className="sushiman-card" id="sushiman">
      <img src={image} alt={`Foto de ${name}`} className="sushiman-img" />
      <div className="sushiman-info">
        <h3 className="sushiman-name">{name}</h3>
        <p className="sushiman-description">{description}</p>
      </div>
    </div>
  );
}
