const COURSES = [
  "Fundamentos del mercado de valores",
  "Lectura de gráficos y análisis técnico",
  "Inteligencia Artificial aplicada al trading",
  "Cómo invertir desde Colombia (plataformas, impuestos, regulación)",
  "Estrategias con las 5 acciones seleccionadas",
];

export function createCoursesPage() {
  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Cursos de inversión con IA</h2>
            <p class="muted">Ruta progresiva para construir criterio técnico y operativo.</p>
          </header>
          <section class="card stack-md">
            ${COURSES.map(
              (course, i) => `
                <article>
                  <span class="badge badge-up">Módulo ${i + 1}</span>
                  <h3>${course}</h3>
                </article>
              `
            ).join("")}
          </section>
        </section>
      `;
    },
    init() {},
  };
}
