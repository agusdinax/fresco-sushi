// src/components/Panel/Sidebar.tsx
import { Link, useNavigate } from "react-router-dom";
import "./panel.css";
import logo from "../../assets/FRESCO.png";

const Sidebar = ({ user }: { user: any }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <img src={logo} alt="FRESCO" className="sidebar-logo" />
      <p className="sidebar-user">👤 {user?.id}</p>
      <nav className="sidebar-nav">
        <Link to="/panel/dashboard">📊 Dashboard</Link>
        {user?.rol === "dueño" && <Link to="/panel/crear-producto">➕ Crear Producto</Link>}
        <Link to="/panel/pedidos">📦 Pedidos</Link>
      </nav>
      <button className="logout-btn" onClick={logout}>Cerrar sesión</button>
    </aside>
  );
};

export default Sidebar;
