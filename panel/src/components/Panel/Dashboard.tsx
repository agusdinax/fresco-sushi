import { useEffect, useState } from "react";

interface Pedido {
  _id: string;
  nombreCliente: string;
  telefono: string;
  productos: {
    producto: { nombre: string } | string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  metodoPago: string;
  tipoEntrega: string;
  address?: string;
  estado: string;
  fechaPedido: string;
}

export const Dashboard = () => {
  const [resumen, setResumen] = useState({
    totalMes: 0,
    pendientes: 0,
    dia: 0,
  });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);

    const obtenerPedidos = () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            console.error("La respuesta no es un array:", data);
            return;
          }

          const hoy = new Date();
          const hoyStr = hoy.toDateString();
          const mesActual = hoy.getMonth();
          const añoActual = hoy.getFullYear();

          const pedidosDelDia = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return fecha.toDateString() === hoyStr;
          });

          const pedidosMes = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return (
              fecha.getMonth() === mesActual &&
              fecha.getFullYear() === añoActual
            );
          });

          let visibles = pedidosDelDia;
          if (rolGuardado === "delivery") {
            visibles = visibles.filter((p) => p.estado === "en reparto");
          }

          visibles.sort(
            (a, b) =>
              new Date(b.fechaPedido).getTime() -
              new Date(a.fechaPedido).getTime()
          );

          const pendientes = visibles.filter((p) => p.estado === "pendiente");

          setResumen({
            totalMes: pedidosMes.length,
            pendientes: pendientes.length,
            dia: visibles.length,
          });

          setPedidos(visibles);
        })
        .catch((error) => {
          console.error("Error obteniendo pedidos:", error);
        });
    };

    obtenerPedidos(); // llamada inicial
    const intervalo = setInterval(obtenerPedidos, 5000); // cada 5 seg.

    return () => clearInterval(intervalo); // limpieza
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
    <div className="panel-content">
      <h2>📊 Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card">📅 Pedidos del día: {resumen.dia}</div>
        <div className="card">⏳ Pendientes: {resumen.pendientes}</div>
        <div className="card">📈 Total del mes: {resumen.totalMes}</div>
      </div>

      <h3 style={{ marginTop: "2rem" }}>📦 Listado de Pedidos</h3>
      <div className="tabla-scroll">
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Entrega</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Fecha</th>
              {rol === "owner" && <th>Actualizar</th>}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido._id} data-estado={pedido.estado}>
                <td>{pedido.nombreCliente}</td>
                <td>{pedido.telefono}</td>
                <td>
                  {pedido.productos.map((p, i) => (
                    <div key={i}>
                      {p.cantidad}×{" "}
                      {typeof p.producto === "string"
                        ? p.producto
                        : p.producto.nombre}
                    </div>
                  ))}
                </td>
                <td>${pedido.total.toFixed(2)}</td>
                <td>{pedido.metodoPago}</td>
                <td>{pedido.tipoEntrega}</td>
                <td>{pedido.address || "-"}</td>
                <td>{pedido.estado}</td>
                <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                {rol === "owner" && (
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
