import { useEffect, useState } from "react";

interface Pedido {
  _id: string;
  usuario: {
    nombre?: string;
    email: string;
  };
  productos: {
    producto: {
      nombre: string;
      precio: number;
    };
    cantidad: number;
  }[];
  estado: string;
  fechaPedido: string;
}

export const Dashboard = () => {
  const [resumen, setResumen] = useState({ total: 0, pendientes: 0, dia: 0 });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);

    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("La respuesta no es un array:", data);
          return;
        }

        setPedidos(data);

        const hoy = new Date().toDateString();
        const pedidosHoy = data.filter(
          (p: Pedido) => new Date(p.fechaPedido).toDateString() === hoy
        );
        const pendientes = data.filter((p: Pedido) => p.estado === "pendiente");

        setResumen({
          total: data.length,
          pendientes: pendientes.length,
          dia: pedidosHoy.length,
        });
      })
      .catch((error) => {
        console.error("Error obteniendo pedidos:", error);
      });
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pedidos/${id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (res.ok) {
        const actualizado = await res.json();
        setPedidos((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, estado: actualizado.estado } : p
          )
        );
      } else {
        console.error("Error actualizando estado del pedido");
      }
    } catch (err) {
      console.error("Error en fetch PATCH:", err);
    }
  };

  return (
    <div>
      <h2>📊 Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card">Pedidos del día: {resumen.dia}</div>
        <div className="card">Pendientes: {resumen.pendientes}</div>
        <div className="card">Total pedidos: {resumen.total}</div>
      </div>

      <h3 style={{ marginTop: "2rem" }}>📦 Listado de Pedidos</h3>
      <div className="tabla-scroll">
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Fecha</th>
              {rol === "dueño" && <th>Actualizar</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pedidos) &&
              pedidos.map((pedido) => (
                <tr key={pedido._id}>
                  <td>{pedido.usuario?.nombre || pedido.usuario.email}</td>
                  <td>
                    {pedido.productos.map((p, i) => (
                      <div key={i}>
                        {p.cantidad}× {p.producto.nombre}
                      </div>
                    ))}
                  </td>
                  <td>{pedido.estado}</td>
                  <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                  {rol === "dueño" && (
                    <td>
                      <select
                        value={pedido.estado}
                        onChange={(e) =>
                          actualizarEstado(pedido._id, e.target.value)
                        }
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en preparación">En preparación</option>
                        <option value="en reparto">En reparto</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
