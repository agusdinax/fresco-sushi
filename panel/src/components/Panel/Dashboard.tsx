import { useEffect, useState } from "react";
import "./Dashboard.css";

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
  comentario?: string;
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

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);

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

          // Pedidos del día
          const pedidosDelDia = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return fecha.toDateString() === hoyStr;
          });

          // Pedidos del mes (todos)
          const pedidosMes = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
          });

          let visibles = pedidosDelDia;

          if (rolGuardado === "delivery") {
            visibles = visibles.filter((p) => p.tipoEntrega.toLowerCase() === "takeaway");
          }

          visibles.sort(
            (a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
          );

          if (rolGuardado === "delivery") {
            const pendientesEntrega = visibles.filter((p) => p.estado === "en reparto").length;
            const totalHoyTakeaway = pedidosDelDia.filter(
              (p) => p.tipoEntrega.toLowerCase() === "takeaway"
            ).length;

            setResumen({ totalMes: 0, pendientes: pendientesEntrega, dia: totalHoyTakeaway });
          } else {
            const pendientes = visibles.filter((p) => p.estado === "pendiente");

            setResumen({ totalMes: pedidosMes.length, pendientes: pendientes.length, dia: visibles.length });
          }

          setPedidos(visibles);
        })
        .catch((error) => {
          console.error("Error obteniendo pedidos:", error);
          setSnackbar({ mensaje: "❌ Error cargando pedidos", tipo: "error" });
        });
    };

    obtenerPedidos();
    const intervalo = setInterval(obtenerPedidos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        const actualizado = await res.json();
        setPedidos((prev) =>
          prev.map((p) => (p._id === id ? { ...p, estado: actualizado.estado } : p))
        );
        setSnackbar({ mensaje: "✅ Estado actualizado correctamente.", tipo: "ok" });
      } else {
        setSnackbar({ mensaje: "❌ Error al actualizar estado.", tipo: "error" });
      }
    } catch (err) {
      console.error("Error en fetch PATCH:", err);
      setSnackbar({ mensaje: "❌ Error al actualizar estado.", tipo: "error" });
    }

    setTimeout(() => setSnackbar(null), 3000);
  };

  const formatoPesos = (monto: number) =>
    monto.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });

  return (
    <div className="panel-content">
      <h2>📊 Dashboard</h2>

      <div className="dashboard-cards">
        {rol === "delivery" ? (
          <>
            <div className="card">
              <div className="card-label">📦 Pendientes de entrega</div>
              <div className="card-number highlight-orange">{resumen.pendientes}</div>
            </div>
            <div className="card">
              <div className="card-label">📅 Total del día con entrega</div>
              <div className="card-number">{resumen.dia}</div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <div className="card-label">⏳NUEVOS PEDIDOS</div>
              <div className="card-number highlight-orange">{resumen.pendientes}</div>
            </div>
            <div className="card">
              <div className="card-label">📅TOTAL DEL DÍA</div>
              <div className="card-number">{resumen.dia}</div>
            </div>
            <div className="card">
              <div className="card-label">📈TOTAL DEL MES</div>
              <div className="card-number highlight-blue">{resumen.totalMes}</div>
            </div>
          </>
        )}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className={`snackbar ${snackbar.tipo === "ok" ? "snackbar-ok" : "snackbar-error"}`}>
          {snackbar.mensaje}
        </div>
      )}

      <h2>📦 Listado de Pedidos</h2>
      {/* Cards layout para pedidos */}
      <div className="pedidos-cards">
        {pedidos.map((pedido) => (
          <div className="pedido-card" key={pedido._id} data-estado={pedido.estado}>
            <p><strong>Cliente: </strong>{pedido.nombreCliente}</p>
            <p>
              <strong>Teléfono:</strong> {pedido.telefono}
            </p>
            <p>
              <strong>Productos:</strong>
            </p>
            <ul>
              {pedido.productos.map((p, i) => (
                <li key={i}>
                  {p.cantidad} × {typeof p.producto === "string" ? p.producto : p.producto.nombre}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total:</strong> {formatoPesos(pedido.total)}
            </p>
            <p>
              <strong>Método Pago:</strong> {pedido.metodoPago}
            </p>
            <p>
              <strong>Entrega:</strong> {pedido.tipoEntrega}
            </p>
            <p>
              <strong>Dirección:</strong> {pedido.address || "-"}
            </p>
            <p>
              <strong>Comentario:</strong> {pedido.comentario || "-"}
            </p>
            <p>
              <strong>Estado:</strong> {pedido.estado}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}
            </p>

            {rol === "owner" && (
              <select
                value={pedido.estado}
                onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en preparación">En preparación</option>
                <option value="en reparto">En reparto</option>
                <option value="entregado">Entregado</option>
                <option value="entregado">Cancelado</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
