// HorariosFresco.tsx
import { Clock } from "lucide-react";
import "./HorariosFresco.css";

interface HorariosFrescoProps {
  isOpen: boolean;
}

export default function HorariosFresco({ isOpen }: HorariosFrescoProps) {
  return (
    <div className={`horario-bar ${isOpen ? "open" : "closed"}`}>
      <div className="horario-content">
        <div className="horario-status">
          <Clock size={18} style={{ marginRight: "0.5rem" }} />
          {isOpen ? (
            "¡Estamos abiertos! - Hace tu pedido"
          ) : (
            "Cerrado · abrimos de Miércoles a Domingo de 19:00 a 00:00"
          )}
        </div>

        <div className="horario-franja">
          🕒 Miércoles a Domingo de 19:00 a 00:00
        </div>

        <div className="horario-ubicacion">
          📍🚚 Take-away y Delivery en la ciudad de <strong>Balcarce</strong>
        </div>
      </div>
    </div>
  );
}
