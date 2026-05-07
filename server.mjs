import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KNOWLEDGE_BASE } from "./data/knowledge-base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 5500);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const PRIMARY_MODEL = "gemini-2.5-flash";
const MODEL_FALLBACK_ORDER = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];
const MAX_RETRIES_PER_MODEL = 2;
const RESPONSE_CACHE_TTL_MS = 60_000;
const responseCache = new Map();
let discoveredModelsCache = { expiresAt: 0, models: [] };

const MIME_BY_EXT = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const idx = trimmed.indexOf("=");
    if (idx < 1) {
      continue;
    }
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sanitizePath(urlPath) {
  const normalized = path
    .normalize(urlPath || "/")
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^[/\\]+/, "");
  return !normalized || normalized === "." ? "index.html" : normalized;
}

function buildFallbackAnswer(userMessage) {
  return [
    "Estoy en modo de alta demanda y no pude consultar Gemini ahora mismo.",
    "Puedo ayudarte con estos temas de la plataforma: historia del trading, inversion desde Colombia, acciones (MSFT, NVDA, NU, EC, CIBEST), cursos y perfil del instructor.",
    `Tu pregunta fue: "${userMessage}". Intenta de nuevo en 1-2 minutos para respuesta en vivo.`,
  ].join("\n");
}

function getCachedAnswer(prompt) {
  const key = prompt.toLowerCase();
  const entry = responseCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.answer;
}

function setCachedAnswer(prompt, answer) {
  responseCache.set(prompt.toLowerCase(), {
    answer,
    expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
  });
}

async function listGenerateContentModels(apiKey) {
  const now = Date.now();
  if (discoveredModelsCache.expiresAt > now && discoveredModelsCache.models.length > 0) {
    return discoveredModelsCache.models;
  }

  const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const models = (data?.models || [])
    .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
    .map((m) => String(m.name || "").replace(/^models\//, ""))
    .filter(Boolean);

  discoveredModelsCache = {
    models,
    expiresAt: now + 10 * 60_000,
  };
  return models;
}

function buildModelCandidates(discoveredModels) {
  const preferred = [PRIMARY_MODEL, ...MODEL_FALLBACK_ORDER];
  const discoveredSet = new Set(discoveredModels);
  const orderedPreferred = preferred.filter((m) => discoveredSet.has(m));
  const dynamicDiscovered = discoveredModels.filter((m) => !preferred.includes(m));
  return [...orderedPreferred, ...dynamicDiscovered];
}

async function askGemini(userMessage) {
  if (typeof fetch !== "function") {
    return {
      ok: false,
      message: "Tu version de Node no soporta fetch nativo. Usa Node 18+.",
      status: 500,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message: "Falta GEMINI_API_KEY en el servidor. Configura tu archivo .env.",
      status: 500,
    };
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
    generationConfig: { maxOutputTokens: 300, temperature: 0.5 },
  };

  const discoveredModels = await listGenerateContentModels(apiKey);
  const modelCandidates = buildModelCandidates(discoveredModels);
  const modelsToTry = modelCandidates.length > 0 ? modelCandidates : [PRIMARY_MODEL, ...MODEL_FALLBACK_ORDER];

  for (const model of modelsToTry) {
    const endpoint = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt += 1) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 404) {
        break;
      }

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES_PER_MODEL) {
          const retryAfterHeader = Number(response.headers.get("Retry-After"));
          const retryDelayMs = Number.isFinite(retryAfterHeader)
            ? retryAfterHeader * 1000
            : 1200 * (attempt + 1);
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          continue;
        }
        if (response.status === 429) {
          return {
            ok: true,
            message: buildFallbackAnswer(userMessage),
            status: 200,
          };
        }
        if (response.status === 401 || response.status === 403) {
          return {
            ok: false,
            message: "La API key no tiene permisos para este modelo o esta restringida.",
            status: response.status,
          };
        }
        return {
          ok: false,
          message: "No pude consultar el asistente en este momento.",
          status: response.status,
        };
      }

      const data = await response.json();
      const answer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No tengo una respuesta disponible ahora. Reformula tu pregunta por favor.";
      setCachedAnswer(userMessage, answer);
      return {
        ok: true,
        message: answer,
        status: 200,
      };
    }
  }

  return {
    ok: false,
    message: "No encontre un modelo Gemini disponible para tu proyecto (404).",
    status: 404,
  };
}

loadDotEnv();

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Bad request." });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
      }
    });
    req.on("end", async () => {
      try {
        const body = JSON.parse(raw || "{}");
        const prompt = String(body?.message || "").trim();
        if (!prompt) {
          sendJson(res, 400, { error: "El campo message es obligatorio." });
          return;
        }
        const cachedAnswer = getCachedAnswer(prompt);
        if (cachedAnswer) {
          sendJson(res, 200, { answer: cachedAnswer, cached: true });
          return;
        }
        let result;
        try {
          result = await askGemini(prompt);
        } catch (error) {
          console.error("askGemini failed:", error);
          sendJson(res, 500, {
            error:
              "Fallo interno llamando Gemini. Verifica GEMINI_API_KEY, conexion de red y Node 18+.",
          });
          return;
        }

        if (!result.ok) {
          sendJson(res, result.status, { error: result.message });
          return;
        }
        sendJson(res, 200, { answer: result.message });
      } catch (error) {
        console.error("Request parsing failed:", error);
        sendJson(res, 500, { error: "Error interno procesando la solicitud." });
      }
    });
    return;
  }

  const requestedPath = sanitizePath(new URL(req.url, `http://${req.headers.host}`).pathname);
  const staticPath = path.join(__dirname, requestedPath);

  if (!staticPath.startsWith(__dirname) || !fs.existsSync(staticPath) || fs.statSync(staticPath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(staticPath).toLowerCase();
  const mime = MIME_BY_EXT[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(staticPath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
