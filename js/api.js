export async function askInvestmentAssistant(userMessage) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    if (!response.ok) {
      return data?.error || "No pude consultar el asistente en este momento.";
    }

    return data?.answer || "No tengo una respuesta disponible ahora. Reformula tu pregunta por favor.";
  } catch (_error) {
    return "No hay conexion con el servidor local. Inicia server.mjs e intenta nuevamente.";
  }
}
