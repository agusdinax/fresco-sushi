import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../assets/FRESCO.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rol = localStorage.getItem("rol");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
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
        <p className="sidebar-user">🙎‍♂️ {user?.nombre || "Usuario"}</p>

        <nav className="sidebar-nav">
          <Link to="/panel/dashboard" onClick={() => setOpen(false)}>📊 Dashboard</Link>
          {rol?.toLowerCase() === "owner" && (
            <>
              <Link to="/panel/crear-producto" onClick={() => setOpen(false)}>➕ Menú</Link>
              <Link to="/panel/pedidos" onClick={() => setOpen(false)}>📦 Historial Pedidos</Link>
              <Link to="/panel/reportes" onClick={() => setOpen(false)}>📈 Reportes</Link>
            </>
          )}
          {rol?.toLowerCase() === "delivery" && (
            <>
            <Link to="/panel/pedidos" onClick={() => setOpen(false)}>📦 Pedidos</Link>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
          <footer className="sidebar-footer">Versión 1.0.0</footer>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
