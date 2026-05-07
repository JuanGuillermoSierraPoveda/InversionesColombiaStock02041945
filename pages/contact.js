import { validateEmail } from "../js/utils.js";

export function createContactPage() {
  let formHandler;

  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Contáctanos</h2>
            <p class="muted">Te respondemos en horario de atención: lunes a viernes, 8:00 a.m. - 6:00 p.m.</p>
          </header>

          <section class="card stack-md">
            <form id="contact-form" class="stack-md" novalidate>
              <div class="stack-sm">
                <label for="name">Nombre</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div class="stack-sm">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div class="stack-sm">
                <label for="message">Mensaje</label>
                <textarea id="message" name="message" rows="4" required></textarea>
              </div>
              <button class="btn btn-secondary" type="submit">Enviar mensaje</button>
              <p id="contact-feedback" role="status" aria-live="polite"></p>
            </form>
          </section>

          <section class="card">
            <h3>Redes sociales</h3>
            <p>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a> |
              <a href="https://x.com" target="_blank" rel="noreferrer">X</a> |
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            </p>
          </section>
        </section>
      `;
    },
    init() {
      const form = document.getElementById("contact-form");
      const feedback = document.getElementById("contact-feedback");

      formHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !message) {
          feedback.className = "error-text";
          feedback.textContent = "Completa todos los campos para continuar.";
          return;
        }

        if (!validateEmail(email)) {
          feedback.className = "error-text";
          feedback.textContent = "Ingresa un correo válido.";
          return;
        }

        feedback.className = "success-text";
        feedback.textContent = "Mensaje recibido. Te contactaremos pronto.";
        form.reset();
      };

      form.addEventListener("submit", formHandler);
    },
    destroy() {
      const form = document.getElementById("contact-form");
      if (form && formHandler) {
        form.removeEventListener("submit", formHandler);
      }
    },
  };
}
