import { KNOWLEDGE_BASE } from "../data/knowledge-base.js";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash-latest"];
const MAX_RETRIES_PER_MODEL = 2;

function getApiKey() {
  // Frontend puro: se permite configurar la llave en runtime para pruebas locales.
  return window.GEMINI_API_KEY || "";
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function askInvestmentAssistant(userMessage) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "Configura window.GEMINI_API_KEY en consola para habilitar respuestas en vivo.";
  }

  const systemPrompt = `
Eres el asistente virtual de la plataforma de inversion de Juan Guillermo Julio Lee Sierra Poveda.
Solo puedes responder preguntas basadas en la siguiente informacion:
${KNOWLEDGE_BASE}
Si la pregunta esta fuera de este contexto, responde amablemente que solo puedes ayudar con temas relacionados a esta plataforma.
`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nPregunta del usuario: ${userMessage}` }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.5,
    },
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 14000);

  try {
    for (const model of GEMINI_MODELS) {
      const endpoint = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
      for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt += 1) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (response.status === 404) {
          break;
        }

        if (!response.ok) {
          if (response.status === 429) {
            const retryAfterHeader = Number(response.headers.get("Retry-After"));
            const retryDelayMs = Number.isFinite(retryAfterHeader)
              ? retryAfterHeader * 1000
              : 1200 * (attempt + 1);

            if (attempt < MAX_RETRIES_PER_MODEL) {
              await sleep(retryDelayMs);
              continue;
            }
            return "Se alcanzó el límite de solicitudes (429). Espera unos minutos o revisa tu cuota en Google AI Studio.";
          }

          if (response.status === 401 || response.status === 403) {
            return "La API key no tiene permisos para este modelo o esta restringida.";
          }
          return "No pude consultar el asistente en este momento. Intenta nuevamente en unos minutos.";
        }

        const data = await response.json();
        return (
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No tengo una respuesta disponible ahora. Reformula tu pregunta por favor."
        );
      }
    }

    return "No encontre un modelo Gemini disponible para tu proyecto (404).";
  } catch (_error) {
    return "La consulta excedio el tiempo limite o no hubo conexion con el servicio.";
  } finally {
    window.clearTimeout(timeoutId);
  }
}
