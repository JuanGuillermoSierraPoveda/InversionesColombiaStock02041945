# 📊 Plan de Desarrollo — Landing Page de Inversión en Acciones desde Colombia

## 🎯 Objetivo del Proyecto

Desarrollar una landing page profesional, modular y escalable orientada a inversores colombianos, que incluya información de mercado, perfil de instructor, chatbot con IA y módulos de contacto y cursos.

---

## 🗂️ Arquitectura del Proyecto

```
trading-landing/
├── index.html               # Punto de entrada principal
├── .env.example             # Variables de entorno (API keys)
├── PLAN_CURSOR.md           # Este archivo
├── css/
│   ├── variables.css        # Design tokens (colores, tipografía, espaciado)
│   ├── base.css             # Reset y estilos globales
│   ├── layout.css           # Estructura, grid, sidebar
│   ├── components.css       # Cards, botones, badges, modales
│   └── animations.css       # Transiciones y keyframes
├── js/
│   ├── app.js               # Bootstrap de la app (inicializa módulos)
│   ├── router.js            # Navegación SPA (hash-based)
│   ├── api.js               # Capa de comunicación con APIs externas
│   ├── utils.js             # Helpers reutilizables
│   └── eventBus.js          # Sistema de eventos desacoplado
├── pages/
│   ├── home.js              # Módulo: Historia del Trading
│   ├── stocks.js            # Módulo: Las 5 Acciones
│   ├── courses.js           # Módulo: Cursos de IA y Trading
│   ├── profile.js           # Módulo: Perfil del Instructor
│   ├── contact.js           # Módulo: Contáctanos
│   └── chatbot.js           # Módulo: Chatbot con Gemini API
├── data/
│   └── knowledge-base.js    # Base de conocimiento para el chatbot
└── assets/
    └── (imágenes, íconos)
```

---

## 📋 Módulos del Sistema

### 1. 🏠 Home — Historia del Trading
- Narrativa histórica del trading: desde Wall Street 1792 hasta el trading digital
- Sección sobre inversión desde Colombia
- Diseño minimalista con tipografía editorial

### 2. 📈 Acciones (Stocks)
Las 5 acciones principales:
| Ticker | Empresa | Mercado |
|--------|---------|---------|
| MSFT | Microsoft Corporation | NASDAQ |
| NVDA | NVIDIA Corporation | NASDAQ |
| NU | Nu Holdings (Nubank) | NYSE |
| EC | Ecopetrol S.A. | NYSE / BVC |
| CIBEST | Grupo Cibest | BVC Colombia |

- Cards con precio simulado, variación y mini-chart
- Datos de contexto sobre por qué cada acción es relevante para un inversor colombiano

### 3. 🎓 Cursos de Inversión con IA
**Módulo 1**: Fundamentos del mercado de valores
**Módulo 2**: Lectura de gráficos y análisis técnico  
**Módulo 3**: Inteligencia Artificial aplicada al trading
**Módulo 4**: Cómo invertir desde Colombia (plataformas, impuestos, regulación)
**Módulo 5**: Estrategias con las 5 acciones seleccionadas

### 4. 👤 Perfil del Instructor
**Juan Guillermo Julio Lee Sierra Poveda**
- Trayectoria profesional completa
- Certificaciones y logros
- Áreas de expertise

### 5. 🤖 Chatbot — Asistente de Inversión
- Integración con **Google AI Studio (Gemini Flash 1.5)**
- Base de conocimiento delimitada (solo responde sobre los contenidos del sitio)
- Interfaz de chat flotante o en página

### 6. 📬 Contáctanos
- Formulario de contacto (nombre, email, mensaje)
- Links a redes sociales
- Horario de atención

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Estructura | HTML5 semántico |
| Estilos | CSS3 con Custom Properties |
| Lógica | Vanilla JavaScript (ES6+) |
| Chatbot IA | Google Gemini Flash 1.5 API |
| Navegación | Hash-based SPA Router |
| Datos | JSON / JS modules |

---

## 🎨 Paleta de Colores

```css
--color-primary:    #1a7f5a;   /* Verde inversión */
--color-secondary:  #1e3a5f;   /* Azul profundo */
--color-accent:     #00c896;   /* Verde lima acento */
--color-bg:         #ffffff;   /* Fondo blanco */
--color-surface:    #f4f8f7;   /* Superficie suave */
--color-text:       #1a2332;   /* Texto oscuro */
--color-muted:      #6b7c8d;   /* Texto secundario */
```

---

## ⚙️ Principios de Desarrollo

### Modularidad
- Cada módulo/página es un objeto JS independiente con métodos `render()` e `init()`
- Los módulos se registran en el router y se montan/desmontan dinámicamente

### Reutilización
- **`utils.js`**: Formateo de números, fechas, validaciones
- **`api.js`**: Una sola capa para todas las llamadas externas
- **`components.css`**: Clases atómicas reutilizables (`.card`, `.btn`, `.badge`)

### Escalabilidad
- Nuevas páginas = un nuevo archivo en `/pages/` + registro en router
- Nuevas acciones = agregar un objeto en el array de `stocks.js`
- Base de conocimiento separada del lógica del chatbot

### Buenas Prácticas
- Variables de entorno en `.env.example` (nunca credenciales en código)
- Separación de responsabilidades (HTML estructura, CSS presentación, JS comportamiento)
- Eventos desacoplados mediante EventBus
- Código comentado y auto-documentado

---

## 🔐 Variables de Entorno

```env
# Google AI Studio - Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Configuración general
APP_NAME=Trading Colombia
APP_ENV=development
```

---

## 🚀 Flujo de Arranque

```
index.html carga
    → base.css + variables.css (estilos globales)
    → app.js (inicializa)
        → router.js (detecta ruta hash)
            → page module render()
                → eventBus listeners
                → api calls si aplica
```

---

## 📅 Fases de Desarrollo

| Fase | Descripción | Archivos |
|------|-------------|----------|
| 1 | Setup base + estilos | variables.css, base.css, layout.css, index.html |
| 2 | Navegación y router | router.js, app.js |
| 3 | Módulos de contenido | pages/home.js, stocks.js, courses.js, profile.js |
| 4 | Chatbot + Knowledge Base | chatbot.js, data/knowledge-base.js, api.js |
| 5 | Contacto + pulido final | contact.js, animations.css |

---

## 🤖 Estrategia del Chatbot

El chatbot solo responde sobre:
1. Contenido del **home** (historia del trading)
2. Las **5 acciones** y su contexto
3. Los **cursos** disponibles
4. El **perfil del instructor**

Se implementa inyectando el `knowledge-base.js` como **system prompt** en cada llamada a Gemini, instruyendo al modelo a rechazar preguntas fuera de scope con un mensaje amigable.

```js
const systemPrompt = `
Eres el asistente virtual de la plataforma de inversión de Juan Guillermo Julio Lee Sierra Poveda.
Solo puedes responder preguntas basadas en la siguiente información:
${KNOWLEDGE_BASE}
Si la pregunta está fuera de este contexto, responde amablemente que solo puedes 
ayudar con temas relacionados a esta plataforma.
`;
```

---

*Documento generado para el plan de desarrollo en Cursor IDE*
