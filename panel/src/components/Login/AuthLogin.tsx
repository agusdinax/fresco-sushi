import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/FRESCO.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

const Alert = MuiAlert as typeof MuiAlert;

export const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<AlertColor>("success");

  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setSnackbarType("warning");
      setSnackbarMsg("Completá ambos campos.");
      setSnackbarOpen(true);
      return;
    }

    if (!validateEmail(email)) {
      setSnackbarType("error");
      setSnackbarMsg("El correo ingresado no es válido.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message?.toLowerCase();
        setSnackbarMsg(
          msg.includes("email")
            ? "El usuario no está registrado."
            : msg.includes("contraseña")
            ? "La contraseña es incorrecta."
            : data.message || "Error al iniciar sesión."
        );

        setSnackbarType("error");
        setSnackbarOpen(true);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      setSnackbarType("success");
      setSnackbarMsg("Inicio de sesión exitoso.");
      setSnackbarOpen(true);

      setTimeout(() => {
        if (data.rol === "dueño") {
          navigate("/panel/dashboard");
        } else if (data.rol === "delivery") {
          navigate("/panel/pedidos");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setSnackbarType("error");
      setSnackbarMsg("Error al conectar con el servidor.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo" className="auth-logo" />
      <h2 className="h2title">Panel de Administración</h2>
      <form className="auth-form" onSubmit={handleLogin}>

        <div className="input-group">
          <span className="input-icon" aria-hidden="true">
            {/* Ícono usuario (email) */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Ingresá tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <span className="input-icon" aria-hidden="true">
            {/* Ícono candado (password) */}
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2zm6-7h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zM8 7a4 4 0 0 1 8 0v3H8V7z"/>
            </svg>
          </span>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Iniciar sesión</button>
      </form>

      <p className="auth-link">
        ¿No tenés cuenta? <a href="/register">Crear usuario</a>
      </p>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarType}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};
