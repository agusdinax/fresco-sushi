import { useState } from "react";
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
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Contacto</h2>

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <small>{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <small>{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Mensaje</label>
            <textarea
              name="message"
              placeholder="Escribí tu mensaje..."
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "error" : ""}
            />
            {errors.message && <small>{errors.message}</small>}
          </div>

          <button type="submit">Enviar</button>

          {submitted && <p className="success-message">Mensaje enviado con éxito 🎉</p>}
        </form>
      </div>
    </section>
  );
};
