export function createProfilePage() {
  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Perfil del instructor</h2>
            <p class="muted">Juan Guillermo Julio Lee Sierra Poveda</p>
          </header>
          <section class="card">
            <h3>Trayectoria profesional</h3>
            <p>
              Experiencia en formación financiera, análisis de mercados y diseño de metodologías
              prácticas para personas que inician en inversión bursátil.
            </p>
            <h3>Certificaciones y logros</h3>
            <p>
              Formación continua en mercados financieros, análisis técnico y uso de IA aplicada a
              procesos de investigación y toma de decisiones.
            </p>
            <h3>Áreas de expertise</h3>
            <p>
              Educación en trading, selección de activos, gestión básica de riesgo y enfoque
              contextual para inversores en Colombia.
            </p>
          </section>
        </section>
      `;
    },
    init() {},
  };
}
