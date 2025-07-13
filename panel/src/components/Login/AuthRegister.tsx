import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/FRESCO.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

const Alert = MuiAlert as typeof MuiAlert;

export const AuthRegister = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<AlertColor>("success");

  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setSnackbarType("warning");
      setSnackbarMsg("Completá todos los campos.");
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
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password, rol: "admin" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMsg(data.message || "Error al registrar el usuario.");
        setSnackbarOpen(true);
        return;
      }

      localStorage.setItem("token", data.token);
      setSnackbarType("success");
      setSnackbarMsg("Usuario creado correctamente.");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
      <h2>Crear nuevo usuario</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <label htmlFor="nombre">Nombre completo:</label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          placeholder="Ingresá tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label htmlFor="email">Correo electrónico:</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Ingresá tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Ingresá tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarme</button>
      </form>

      <p className="auth-link">
        ¿Ya tenés cuenta? <a href="/login">Volver al login</a>
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
