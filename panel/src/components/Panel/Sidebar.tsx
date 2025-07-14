// src/components/Panel/Sidebar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/FRESCO.png";

const Sidebar = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-top">
        <img src={logo} alt="FRESCO" className="sidebar-logo" />
        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      <div className={`sidebar-content ${open ? "show" : ""}`}>
        <p className="sidebar-user">👤 {user?.nombre || user?.email}</p>

        <nav className="sidebar-nav">
          <Link to="/panel/dashboard" onClick={() => setOpen(false)}>📊 Dashboard</Link>
          {user?.rol === "owner" && (
            <>
              <Link to="/panel/crear-producto" onClick={() => setOpen(false)}>➕ Crear Producto</Link>
              <Link to="/panel/reportes" onClick={() => setOpen(false)}>📈 Reportes</Link>
            </>
          )}
          <Link to="/panel/pedidos" onClick={() => setOpen(false)}>📦 Pedidos</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
        <footer className="sidebar-footer">Versión 1.0.0</footer>
      </div>
    </aside>
  );
};

export default Sidebar;