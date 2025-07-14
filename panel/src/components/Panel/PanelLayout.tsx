import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import "./panel.css";

const PanelLayout = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

useEffect(() => {
  const rol = localStorage.getItem("rol");
  if (!rol) {
    navigate("/login");
  } else {
    setUser({ rol }); // pasamos un objeto con el rol
  }
}, []);

  return (
    <div className="panel-layout">
      <Sidebar user={user} />
      <main className="panel-content">
        {/* RENDERIZA AQUÍ LAS RUTAS HIJAS */}
        <Outlet />
      </main>
    </div>
  );
};

export default PanelLayout;
