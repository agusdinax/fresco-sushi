// src/components/Pedidos/ListaPedidos.tsx
import { useEffect, useState } from "react";

export const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPedidos);
  }, []);

  return (
    <div>
      <h2>📦 Pedidos Activos</h2>
      <ul className="lista-pedidos">
        {pedidos.map((pedido: any) => (
          <li key={pedido._id} className="pedido-item">
            <strong>{pedido.nombreCliente}</strong> - {pedido.estado} - ${pedido.total}
          </li>
        ))}
      </ul>
    </div>
  );
};
