// src/components/Panel/Dashboard.tsx
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [resumen, setResumen] = useState({ total: 0, pendientes: 0, dia: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const hoy = new Date().toDateString();
        const pedidosHoy = data.filter((p: any) => new Date(p.fechaPedido).toDateString() === hoy);
        const pendientes = data.filter((p: any) => p.estado === "pendiente");
        setResumen({
          total: data.length,
          pendientes: pendientes.length,
          dia: pedidosHoy.length,
        });
      });
  }, []);

  return (
    <div>
      <h2>📊 Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">Pedidos del día: {resumen.dia}</div>
        <div className="card">Pendientes: {resumen.pendientes}</div>
        <div className="card">Total pedidos: {resumen.total}</div>
      </div>
    </div>
  );
};
