import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import "./HorariosFresco.css";

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

const getNextOpening = (now = new Date()): Date | null => {
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const day = date.toLocaleDateString("es-AR", { weekday: "long" }) as Day;
    if (!(day in SCHEDULE)) continue;
    for (const [open] of SCHEDULE[day]) {
      const opening = hhmmToDate(date, open);
      if (opening > now) return opening;
    }
  }
  return null;
};

export default function HorariosFresco() {
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpen, setNextOpen] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const today = now.toLocaleDateString("es-AR", {
        weekday: "long",
      }) as Day;
      const openToday = SCHEDULE[today]?.some((range) =>
        nowBetween(range, now)
      );
      setIsOpen(openToday);
      setNextOpen(openToday ? null : getNextOpening(now));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`horario-bar ${isOpen ? "open" : "closed"}`}>
      <div className="horario-content">
        <div className="horario-status">
          <Clock size={18} style={{ marginRight: "0.5rem" }} />
          {isOpen ? (
            "¡Estamos abiertos! - Hace tu pedido"
          ) : nextOpen ? (
            <>
               Cerrado · abrimos{" "}
                {nextOpen.toLocaleDateString("es-AR", {
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).replace(/^\w/, (l) => l.toUpperCase())}
            </>
          ) : (
            "Cerrado"
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
