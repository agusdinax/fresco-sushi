import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import type { Range } from "react-date-range";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { es } from "date-fns/locale";

import "dayjs/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./ListaPedidos.css";

dayjs.extend(isBetween);
dayjs.locale("es");

interface Producto {
  producto: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  _id: string;
  nombreCliente: string;
  telefono: string;
  productos: Producto[];
  total: number;
  estado: "pendiente" | "en preparación" | "en reparto" | "entregado";
  fechaPedido: string;
  usuario: string;
  metodoPago: string;
  tipoEntrega: string;
  address?: string;
  comentario?: string;
}

const METODOS_PAGO = ["", "Efectivo", "Tarjeta", "Mercado Pago"];
const TIPOS_ENTREGA = ["", "Delivery", "Para llevar", "En local"];

export const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtros, setFiltros] = useState<{
    usuario: string;
    metodoPago: string;
    tipoEntrega: string;
    fechas: Range;
  }>({
    usuario: "",
    metodoPago: "",
    tipoEntrega: "",
    fechas: {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  });
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 20;

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtros.fechas.startDate && filtros.fechas.endDate) {
      const inicio = dayjs(filtros.fechas.startDate).startOf("day");
      const fin = dayjs(filtros.fechas.endDate).endOf("day");
      const fechaPedido = dayjs(pedido.fechaPedido);
      if (!fechaPedido.isBetween(inicio, fin, null, "[]")) return false;
    }
    if (
      filtros.usuario.trim() &&
      !pedido.usuario.toLowerCase().includes(filtros.usuario.toLowerCase().trim())
    )
      return false;
    if (filtros.metodoPago && pedido.metodoPago !== filtros.metodoPago) return false;
    if (filtros.tipoEntrega && pedido.tipoEntrega !== filtros.tipoEntrega) return false;

    return true;
  });

  pedidosFiltrados.sort((a, b) => dayjs(b.fechaPedido).valueOf() - dayjs(a.fechaPedido).valueOf());

  const indexUltimo = paginaActual * pedidosPorPagina;
  const indexPrimero = indexUltimo - pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);

  const quitarFiltro = (tipo: "usuario" | "metodoPago" | "tipoEntrega" | "fechas") => {
    if (tipo === "fechas") {
      setFiltros((f) => ({
        ...f,
        fechas: { startDate: undefined, endDate: undefined, key: "selection" },
      }));
    } else {
      setFiltros((f) => ({ ...f, [tipo]: "" }));
    }
    setPaginaActual(1);
  };

  const formatearFecha = (fecha: string) =>
    dayjs(fecha).format("dddd DD [de] MMMM [de] YYYY");

  return (
    <div className="contenedor-lista">
      <h2 className="titulo-lista">📦 Historial de Pedidos</h2>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por delivery"
          value={filtros.usuario}
          onChange={(e) => {
            setPaginaActual(1);
            setFiltros({ ...filtros, usuario: e.target.value });
          }}
        />

        <select
          value={filtros.metodoPago}
          onChange={(e) => {
            setPaginaActual(1);
            setFiltros({ ...filtros, metodoPago: e.target.value });
          }}
        >
          {METODOS_PAGO.map((mp) => (
            <option key={mp} value={mp}>
              {mp || "Todos los métodos de pago"}
            </option>
          ))}
        </select>

        <select
          value={filtros.tipoEntrega}
          onChange={(e) => {
            setPaginaActual(1);
            setFiltros({ ...filtros, tipoEntrega: e.target.value });
          }}
        >
          {TIPOS_ENTREGA.map((te) => (
            <option key={te} value={te}>
              {te || "Todos los tipos de entrega"}
            </option>
          ))}
        </select>

        <button
          className="btn-fechas"
          onClick={() => setMostrarCalendario(!mostrarCalendario)}
          title="Seleccionar rango de fechas"
        >
          📅 Seleccionar Fechas
        </button>

        <button
          className="btn-limpiar"
          onClick={() => {
            setPaginaActual(1);
            setFiltros({
              usuario: "",
              metodoPago: "",
              tipoEntrega: "",
              fechas: { startDate: undefined, endDate: undefined, key: "selection" },
            });
          }}
        >
          Limpiar filtros ❌
        </button>
      </div>

      {mostrarCalendario && (
        <DateRange
          editableDateInputs
          onChange={(item) => {
            setPaginaActual(1);
            setFiltros({ ...filtros, fechas: item.selection });
          }}
          moveRangeOnFirstSelection={false}
          ranges={[filtros.fechas]}
          locale={es}
          maxDate={new Date()}
        />
      )}

      <div className="filtros-aplicados">
        {filtros.usuario && (
          <span className="filtro-aplicado" onClick={() => quitarFiltro("usuario")}>
            Delivery: {filtros.usuario} ×
          </span>
        )}
        {filtros.metodoPago && (
          <span className="filtro-aplicado" onClick={() => quitarFiltro("metodoPago")}>
            Pago: {filtros.metodoPago} ×
          </span>
        )}
        {filtros.tipoEntrega && (
          <span className="filtro-aplicado" onClick={() => quitarFiltro("tipoEntrega")}>
            Entrega: {filtros.tipoEntrega} ×
          </span>
        )}
        {filtros.fechas.startDate && filtros.fechas.endDate && (
          <span className="filtro-aplicado" onClick={() => quitarFiltro("fechas")}>
            Fechas: {dayjs(filtros.fechas.startDate).format("DD/MM/YYYY")} -{" "}
            {dayjs(filtros.fechas.endDate).format("DD/MM/YYYY")} ×
          </span>
        )}
      </div>

      <div className="lista-pedidos">
        {pedidosPaginados.length === 0 && (
          <p className="sin-resultados">No se encontraron pedidos con esos filtros.</p>
        )}

        {pedidosPaginados.map((pedido) => (
          <div
            key={pedido._id}
            className={`pedido-item ${expandedId === pedido._id ? "expandido" : ""}`}
            onClick={() => setExpandedId((prev) => (prev === pedido._id ? null : pedido._id))}
          >
            <div className="resumen">
              <strong>{pedido.nombreCliente}</strong> - {pedido.estado} - $
              {pedido.total.toLocaleString("es-AR")}
              <br />
              <small>{formatearFecha(pedido.fechaPedido)}</small>
            </div>

            {expandedId === pedido._id && (
              <div className="detalle">
                <p>📞 Teléfono: {pedido.telefono}</p>
                <p>👤 Delivery: {pedido.usuario}</p>
                <p>🚚 Tipo de entrega: {pedido.tipoEntrega}</p>
                <p>💳 Método de pago: {pedido.metodoPago}</p>
                {pedido.address && <p>🏠 Dirección: {pedido.address}</p>}
                {pedido.comentario && <p>💬 Comentario: {pedido.comentario}</p>}

                <ul>
                  {pedido.productos.map((prod, i) => (
                    <li key={i}>
                      {prod.cantidad} x {prod.producto} (${prod.precio.toLocaleString("es-AR")})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
