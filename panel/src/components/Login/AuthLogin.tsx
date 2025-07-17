// src/components/AuthLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/FRESCO.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import type { AlertColor } from "@mui/material/Alert";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

const Alert = MuiAlert as typeof MuiAlert;

export const AuthLogin = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<AlertColor>("success");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreUsuario || !password) {
      setSnackbarType("warning");
      setSnackbarMsg("Completá ambos campos.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombreUsuario, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMsg(data.message || "Error al iniciar sesión.");
        setSnackbarOpen(true);
        return;
      }

      localStorage.setItem("rol", data.rol);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ nombre: data.nombre, id: data.id })
      );

      setSnackbarType("success");
      setSnackbarMsg("Inicio de sesión exitoso.");
      setSnackbarOpen(true);

      setTimeout(() => {
        if (data.rol === "owner" || data.rol === "delivery") {
          navigate("/panel/dashboard");
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

        <TextField
          label="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <button type="submit" className="login-button">Iniciar sesión</button>
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
