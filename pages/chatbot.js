import { askInvestmentAssistant } from "../js/api.js";

export function createChatbotPage() {
  let formHandler;

  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Asistente IA de inversión</h2>
            <p class="muted">
              Responde solo sobre historia del trading, acciones, cursos, perfil e inversión desde Colombia.
            </p>
          </header>

          <section class="card stack-md">
            <div id="chat-log" class="stack-sm" aria-live="polite">
              <p><strong>Asistente:</strong> Hola, ¿en qué tema de la plataforma te ayudo?</p>
            </div>
            <form id="chat-form" class="stack-sm">
              <label for="chat-input">Escribe tu pregunta</label>
              <textarea id="chat-input" rows="3" required></textarea>
              <button class="btn btn-primary" type="submit">Enviar</button>
            </form>
          </section>
        </section>
      `;
    },
    init() {
      const form = document.getElementById("chat-form");
      const input = document.getElementById("chat-input");
      const chatLog = document.getElementById("chat-log");

      formHandler = async (event) => {
        event.preventDefault();
        const prompt = input.value.trim();
        if (!prompt) {
          return;
        }

        chatLog.insertAdjacentHTML("beforeend", `<p><strong>Tú:</strong> ${prompt}</p>`);
        input.value = "";
        chatLog.insertAdjacentHTML("beforeend", `<p><strong>Asistente:</strong> Pensando...</p>`);

        const answer = await askInvestmentAssistant(prompt);
        const thinking = chatLog.querySelector("p:last-child");
        if (thinking) {
          thinking.remove();
        }
        chatLog.insertAdjacentHTML("beforeend", `<p><strong>Asistente:</strong> ${answer}</p>`);
      };

      form.addEventListener("submit", formHandler);
    },
    destroy() {
      const form = document.getElementById("chat-form");
      if (form && formHandler) {
        form.removeEventListener("submit", formHandler);
      }
    },
  };
}
