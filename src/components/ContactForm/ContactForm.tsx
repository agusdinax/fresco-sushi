import { useState } from "react";
import "./ContactForm.css";

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Enviar por fetch a FormSubmit
    fetch("https://formsubmit.co/ajax/TU_EMAIL@ejemplo.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setSubmitted(true);
          form.reset();
        } else {
          alert("Hubo un error, intenta más tarde.");
        }
      })
      .catch(() => alert("Hubo un error, intenta más tarde."));
  };

  return (
    <section className="contact-container">
      <div className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <h2>Contacto</h2>
          <input type="text" name="name" placeholder="Tu nombre" required />
          <input type="email" name="email" placeholder="Tu email" required />
          <textarea name="message" rows={5} placeholder="Escribí tu mensaje" required />

          {/* Estos inputs ocultos son para FormSubmit */}
          <input type="hidden" name="_captcha" value="false" />

          <button type="submit" disabled={submitted}>
            {submitted ? "Mensaje enviado" : "Enviar mensaje"}
          </button>

          {submitted && (
            <p className="success-message">¡Gracias! Tu consulta fue enviada correctamente.</p>
          )}
        </form>

        <div className="contact-image">
          <img src="src/assets/header1.jpg" alt="Sushi contact" loading="lazy" />
        </div>
      </div>
    </section>
  );
};
