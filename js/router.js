const routes = new Map();
let currentCleanup = null;

function getRouteFromHash() {
  const hash = window.location.hash || "#/home";
  const route = hash.replace(/^#/, "");
  return route.startsWith("/") ? route : `/${route}`;
}

function setActiveNav(routePath) {
  const links = document.querySelectorAll("[data-link]");
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === `#${routePath}`);
  });
}

function notFoundPage() {
  return {
    render() {
      return `
        <section class="page fade-in">
          <h2>Página no encontrada</h2>
          <p class="muted">La ruta no existe. Te llevamos al inicio.</p>
        </section>
      `;
    },
    init() {},
  };
}

export function registerRoute(path, moduleFactory) {
  routes.set(path, moduleFactory);
}

export function navigate(path) {
  window.location.hash = `#${path}`;
}

export function renderCurrentRoute({ mountNode }) {
  if (!mountNode) {
    return;
  }

  const routePath = getRouteFromHash();
  const moduleFactory = routes.get(routePath) || notFoundPage;
  const pageModule = moduleFactory();

  if (typeof currentCleanup === "function") {
    currentCleanup();
  }

  mountNode.innerHTML = pageModule.render();
  pageModule.init?.();
  currentCleanup = pageModule.destroy || null;

  if (!routes.has(routePath)) {
    window.setTimeout(() => navigate("/home"), 1200);
  }

  setActiveNav(routePath);
  mountNode.focus();
}
