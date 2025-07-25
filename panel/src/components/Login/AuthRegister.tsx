import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/FRESCO.png";
import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import MuiAlert, { type AlertColor } from "@mui/material/Alert";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
const Alert = MuiAlert as typeof MuiAlert;

export const AuthRegister = () => {
  const [nombre, setNombre] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("delivery");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<AlertColor>("success");

  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !nombreUsuario || !email || !password || !rol) {
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
          body: JSON.stringify({
            nombre,
            nombreUsuario,
            email,
            password,
            rol,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setSnackbarType("error");
        setSnackbarMsg(data.message || "Error al registrar el usuario.");
        setSnackbarOpen(true);
        return;
      }

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
      <h2 className="h2title">Crear nuevo usuario</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <TextField
          fullWidth
          label="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth>
          <InputLabel id="rol-label">
            <AdminPanelSettingsIcon style={{ marginRight: 4 }} />
            Rol
          </InputLabel>
          <Select
            labelId="rol-label"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            label="Rol"
          >
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
          </Select>
        </FormControl>

        <button type="submit" className="login-button">
          Registrarme
        </button>
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
