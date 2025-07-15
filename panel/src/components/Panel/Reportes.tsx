import { useEffect, useState } from "react";
import "./Reportes.css"; 

interface Pedido {
  id: number;
  fecha: string;
  tipoEntrega: "delivery" | "takeaway";
  metodoPago: "efectivo" | "transferencia";
  productos: { nombre: string; cantidad: number }[];
  // Agregá más campos si tu API los incluye
}

const Reportes = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando reportes...</p>;

  const pedidosDelMes = pedidos.filter(p => {
    const fecha = new Date(p.fecha);
    const hoy = new Date();
    return (
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  });

  const totalPedidosMes = pedidosDelMes.length;

  const conteoEntregas = pedidosDelMes.reduce(
    (acc, p) => {
      acc[p.tipoEntrega]++;
      return acc;
    },
    { takeaway: 0, delivery: 0 }
  );

  const conteoPagos = pedidosDelMes.reduce(
    (acc, p) => {
      acc[p.metodoPago]++;
      return acc;
    },
    { efectivo: 0, transferencia: 0 }
  );

  const productos = pedidosDelMes.flatMap(p => p.productos);
  const conteoProductos: Record<string, number> = {};

  productos.forEach(p => {
    conteoProductos[p.nombre] = (conteoProductos[p.nombre] || 0) + p.cantidad;
  });

  const productoMasPedido = Object.entries(conteoProductos).reduce(
    (acc, [nombre, cantidad]) => (cantidad > acc.cantidad ? { nombre, cantidad } : acc),
    { nombre: "", cantidad: 0 }
  );

  return (
    <div className="reporte-panel">
      <h2>📊 Reportes del mes</h2>
      <ul>
        <li>Total de pedidos: <strong>{totalPedidosMes}</strong></li>
        <li>🍣 Opción más pedida: <strong>{productoMasPedido.nombre} ({productoMasPedido.cantidad})</strong></li>
        <li>🚶 Takeaway: <strong>{conteoEntregas.takeaway}</strong></li>
        <li>🏍️ Delivery: <strong>{conteoEntregas.delivery}</strong></li>
        <li>💵 Efectivo: <strong>{conteoPagos.efectivo}</strong></li>
        <li>🏦 Transferencia: <strong>{conteoPagos.transferencia}</strong></li>
      </ul>
    </div>
  );
};

export default Reportes;
