import { useEffect, useState } from "react";
import { TextField, MenuItem, Box } from "@mui/material";
import "./Dashboard.css";
import { Typography } from "@mui/material";
// Íconos MUI
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
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
    enReparto: 0,
    pendienteReparto: 0,
    pendienteTakeaway: 0,
  });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [rol, setRol] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ mensaje: string; tipo: "ok" | "error" } | null>(null);
  const [mostrarDashboardCards, setMostrarDashboardCards] = useState(true); // 👈 NUEVO

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
          if (!Array.isArray(data)) return;

          const hoy = new Date();
          const hoyStr = hoy.toDateString();
          const mesActual = hoy.getMonth();
          const añoActual = hoy.getFullYear();

          const pedidosDelDia = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return fecha.toDateString() === hoyStr;
          });

          const entregadosHoy = pedidosDelDia.filter(
            (p) => p.estado.toLowerCase() === "entregado"
          );

          const entregadosMes = data.filter((p: Pedido) => {
            const fecha = new Date(p.fechaPedido);
            return (
              fecha.getMonth() === mesActual &&
              fecha.getFullYear() === añoActual &&
              p.estado.toLowerCase() === "entregado"
            );
          });

          const visibles = pedidosDelDia.sort(
            (a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
          );

          const nuevos = visibles.filter((p) => p.estado === "pendiente").length;

          const enReparto = visibles.filter((p) => p.estado === "en reparto").length;

          const pendienteReparto = visibles.filter(
            (p) =>
              (p.estado === "pendiente" || p.estado === "en preparación") &&
              p.tipoEntrega.toLowerCase() === "delivery"
          ).length;

          const pendienteTakeaway = visibles.filter(
            (p) =>
              (p.estado === "pendiente" || p.estado === "en preparación") &&
              p.tipoEntrega.toLowerCase() === "takeaway"
          ).length;

          setResumen({
            totalMes: entregadosMes.length,
            pendientes: nuevos,
            dia: entregadosHoy.length,
            enReparto,
            pendienteReparto,
            pendienteTakeaway,
          });

          setPedidos(visibles);
        })
        .catch(() => {
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
    } catch {
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
      <Box
      onClick={() => setMostrarDashboardCards(!mostrarDashboardCards)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        gap: 1, // espacio entre ícono y texto
        mb: 2,
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>
        {mostrarDashboardCards ? '▼' : '►'}
      </span>
      <DashboardIcon />
      <Typography variant="h4" component="span">
        DASHBOARD
      </Typography>
    </Box>
      {mostrarDashboardCards && (
        <div className="dashboard-cards">
          <div className="card">
            <div className="card-label">⏳NUEVOS PEDIDOS</div>
            <div className="card-number highlight-orange">{resumen.pendientes}</div>
          </div>
          <div className="card">
            <div className="card-label">📦 PENDIENTE REPARTO</div>
            <div className="card-number">{resumen.pendienteReparto}</div>
          </div>
          <div className="card">
            <div className="card-label">🍱 PENDIENTE TAKEAWAY</div>
            <div className="card-number">{resumen.pendienteTakeaway}</div>
          </div>
          <div className="card">
            <div className="card-label">🛵 EN REPARTO (HOY)</div>
            <div className="card-number">{resumen.enReparto}</div>
          </div>
          <div className="card">
            <div className="card-label">📅TOTAL DEL DÍA</div>
            <div className="card-number">{resumen.dia}</div>
          </div>
          <div className="card">
            <div className="card-label">📈TOTAL DEL MES</div>
            <div className="card-number highlight-blue">{resumen.totalMes}</div>
          </div>
        </div>
      )}

      {snackbar && (
        <div className={`snackbar ${snackbar.tipo === "ok" ? "snackbar-ok" : "snackbar-error"}`}>
          {snackbar.mensaje}
        </div>
      )}

      {/* PEDIDOS DEL DÍA */}
      <Typography variant="h4" mb={2}>
        <InventoryIcon/>PEDIDOS PARA HOY
      </Typography>
      <div className="pedidos-cards">
        {pedidos.map((pedido) => (
          <div className="pedido-card" key={pedido._id} data-estado={pedido.estado}>
            <p><strong>Cliente: </strong>{pedido.nombreCliente}</p>
            <p><strong>Teléfono:</strong> {pedido.telefono}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {pedido.productos.map((p, i) => (
                <li key={i}>
                  {p.cantidad} × {typeof p.producto === "string" ? p.producto : p.producto.nombre}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> {formatoPesos(pedido.total)}</p>
            <p><strong>Método Pago:</strong> {pedido.metodoPago}</p>
            <p><strong>Entrega:</strong> {pedido.tipoEntrega}</p>
            <p><strong>Dirección:</strong> {pedido.address || "-"}</p>
            <p><strong>Comentario:</strong> {pedido.comentario || "-"}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
            <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
            {/* EL OWNER PUEDE ACTUALIZAR EL ESTADO */}
            {rol === "owner" && (
             <TextField
              select
              label="Estado"
              value={pedido.estado}
              onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              style={{ marginTop: "0.5rem" }}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="en preparación">En preparación</MenuItem>
              <MenuItem value="en reparto">En reparto</MenuItem>
              <MenuItem value="entregado">Entregado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </TextField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};