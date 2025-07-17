import { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import "./ContactForm.css";
import contactImg from "../../assets/header1.jpg";

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje no puede estar vacío";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch("https://formsubmit.co/ajax/agusdinatale96@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" });
        } else {
          alert("Error al enviar el formulario. Intenta más tarde.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema con el envío.");
      }
    }
  };

  return (
    <section className="contact-wrapper" id="contacto">
      <div className="contact-container">
        <div className="contact-image">
          <img src={contactImg} alt="Contacto" />
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Contacto
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nombre"
              placeholder="Ej: Joaquin"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Email"
              placeholder="Ej: sushi@sushi.com"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />

            <TextField
              label="Mensaje"
              placeholder="Ingresa un mensaje"
              name="message"
              variant="outlined"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              fullWidth
            />
            <button type="submit">Enviar</button>
            {submitted && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Mensaje enviado con éxito 🎉
              </Alert>
            )}
          </Box>
        </form>
      </div>
    </section>
  );
};
