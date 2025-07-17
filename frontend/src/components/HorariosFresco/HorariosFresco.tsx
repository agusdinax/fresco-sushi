import { Clock } from "lucide-react";
import "./HorariosFresco.css";

interface HorariosFrescoProps {
  isOpen: boolean;
  nextOpenDay: string | null;
}

export default function HorariosFresco({ isOpen, nextOpenDay }: HorariosFrescoProps) {
  return (
    <div className={`horario-bar ${isOpen ? "open" : "closed"}`}>
      <div className="horario-content">
        <div className="horario-status">
          <Clock style={{ marginRight: "0.5rem", transform: "scale(0.9)", position: "relative", top: "-1px" }} />
          {isOpen ? (
            "¡Estamos abiertos! - Hace tu pedido"
          ) : nextOpenDay === "hoy" ? (
            "Cerrado · abrimos hoy en el horario de 19:00 a 00:00"
          ) : nextOpenDay ? (
            `Cerrado · abrimos el ${nextOpenDay} de 19:00 a 00:00`
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
