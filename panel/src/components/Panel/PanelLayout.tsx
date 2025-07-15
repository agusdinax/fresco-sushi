import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import "./panel.css";

const PanelLayout = () => {
  interface User {
    rol: string;
  }

  const [rol, setRol] = useState<User | null>(null);
  const navigate = useNavigate();

useEffect(() => {
  const rol = localStorage.getItem("rol");
  if (!rol) {
    navigate("/login");
  } else {
    setRol({ rol }); // pasamos un objeto con el rol
  }
}, []);

  return (
    <div className="panel-layout">
      <Sidebar />
      <main className="panel-content">
        {/* RENDERIZA AQUÍ LAS RUTAS HIJAS */}
        <Outlet />
      </main>
    </div>
  );
};

export default PanelLayout;
