import { useEffect, useState } from "react";

interface Pedido {
  _id: string;
  nombreCliente: string;
  telefono: string;
  productos: {
    producto: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: string;
  fechaPedido: string;
  usuario: string;
}

export const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada:", data);
          return;
        }

        let pedidosFiltrados = data;

        if (rol === "delivery") {
          pedidosFiltrados = data.filter(
            (pedido: Pedido) => pedido.estado === "en reparto"
          );
        }

        setPedidos(pedidosFiltrados);
      })
      .catch((error) => {
        console.error("Error al obtener pedidos:", error);
      });
  }, []);

  return (
    <div>
      <h2>📦 Pedidos Activos</h2>
      <ul className="lista-pedidos">
        {pedidos.map((pedido) => (
          <li key={pedido._id} className="pedido-item">
            <strong>{pedido.nombreCliente}</strong> - {pedido.estado} - ${pedido.total}
          </li>
        ))}
      </ul>
    </div>
  );
};
