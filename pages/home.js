export function createHomePage() {
  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Historia del Trading</h2>
            <p class="muted">
              Del Acuerdo de Buttonwood en 1792 a la inversión digital actual.
            </p>
          </header>
          <section class="section card">
            <h3>Evolución del mercado</h3>
            <p>
              El trading moderno nace en plazas físicas como Wall Street y evoluciona con la
              digitalización, permitiendo acceso global a información, órdenes en tiempo real y
              análisis cuantitativo.
            </p>
            <p>
              Hoy, un inversor individual puede construir estrategias robustas con gestión de
              riesgo, diversificación y herramientas de análisis asistidas por inteligencia
              artificial.
            </p>
          </section>
          <section class="section card">
            <h3>Invertir desde Colombia</h3>
            <p>
              Para inversores colombianos, las oportunidades incluyen acciones internacionales y
              activos locales, considerando tasa de cambio, comisiones, impuestos y regulación.
            </p>
            <p>
              Esta plataforma resume conceptos clave para tomar decisiones informadas y graduales.
            </p>
          </section>
        </section>
      `;
    },
    init() {},
  };
}
