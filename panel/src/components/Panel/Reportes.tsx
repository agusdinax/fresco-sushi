import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const colores = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#ff6384"];

interface Pedido {
  fecha: string;
  tipoEntrega: string;
  metodoPago: string;
  items: { nombre: string }[];
}

const Reportes = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(dayjs().month() + 1); // 1 a 12

  const token = localStorage.getItem("token");

  const obtenerPedidos = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPedidos(data);
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter((p) =>
    dayjs(p.fecha).month() + 1 === Number(mesSeleccionado)
  );

  const totalPorTipoEntrega = pedidosFiltrados.reduce((acc: any, p) => {
    acc[p.tipoEntrega] = (acc[p.tipoEntrega] || 0) + 1;
    return acc;
  }, {});

  const totalPorMetodoPago = pedidosFiltrados.reduce((acc: any, p) => {
    acc[p.metodoPago] = (acc[p.metodoPago] || 0) + 1;
    return acc;
  }, {});

  const opcionesContadas = pedidosFiltrados.flatMap((p) =>
    Array.isArray(p.items) ? p.items.map((i) => i.nombre) : []
  );

  const conteoOpciones: Record<string, number> = {};
  opcionesContadas.forEach((nombre) => {
    conteoOpciones[nombre] = (conteoOpciones[nombre] || 0) + 1;
  });

  const dataOpciones = Object.entries(conteoOpciones)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5); // top 5

  return (
    <div className="reportes-panel">
      <div className="filtros">
        <label>Mes:</label>
        <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>{dayjs().month(i).format("MMMM")}</option>
          ))}
        </select>
      </div>

      <div className="graficos-container">
        <div className="grafico">
          <h3>Tipo de entrega</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={Object.entries(totalPorTipoEntrega).map(([tipo, cantidad]) => ({
                name: tipo, value: cantidad
              }))} dataKey="value" nameKey="name" outerRadius={80} label>
                {Object.keys(totalPorTipoEntrega).map((_, index) => (
                  <Cell key={index} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h3>Método de pago</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(totalPorMetodoPago).map(([metodo, cantidad]) => ({
              metodo, cantidad
            }))}>
              <XAxis dataKey="metodo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h3>Top 5 opciones más pedidas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataOpciones}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#ff6384" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
