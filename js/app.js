import { registerRoute, renderCurrentRoute } from "./router.js";
import { createHomePage } from "../pages/home.js";
import { createStocksPage } from "../pages/stocks.js";
import { createCoursesPage } from "../pages/courses.js";
import { createProfilePage } from "../pages/profile.js";
import { createChatbotPage } from "../pages/chatbot.js";
import { createContactPage } from "../pages/contact.js";

function bootstrap() {
  const mountNode = document.getElementById("app");
  if (!mountNode) {
    return;
  }

  registerRoute("/home", createHomePage);
  registerRoute("/stocks", createStocksPage);
  registerRoute("/courses", createCoursesPage);
  registerRoute("/profile", createProfilePage);
  registerRoute("/chatbot", createChatbotPage);
  registerRoute("/contact", createContactPage);

  if (!window.location.hash) {
    window.location.hash = "#/home";
  }

  const rerender = () => renderCurrentRoute({ mountNode });
  window.addEventListener("hashchange", rerender);
  rerender();
}

function showBootError(message) {
  const mountNode = document.getElementById("app");
  if (!mountNode) {
    return;
  }
  mountNode.innerHTML = `
    <section class="page">
      <h2>Error de carga</h2>
      <p class="error-text">${message}</p>
    </section>
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    bootstrap();
  } catch (error) {
    showBootError("No se pudo inicializar la aplicación.");
    // Keep console details for debugging in browser devtools.
    console.error(error);
  }
});
