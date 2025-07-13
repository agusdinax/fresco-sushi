import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
export const PanelLayout = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verificarToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);

        // Si la ruta es exactamente /panel, redirige a la vista correspondiente según rol
        if (location.pathname === "/panel") {
          if (payload.rol === "dueño") {
            navigate("/panel/dashboard");
          } else if (payload.rol === "delivery") {
            navigate("/panel/pedidos");
          } else {
            navigate("/panel/dashboard"); // fallback
          }
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verificarToken();
  }, [location.pathname, navigate]);

  if (!user) return null;

  return (
    <div className="panel-layout">
      <Sidebar user={user} />
      <main className="panel-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PanelLayout;
