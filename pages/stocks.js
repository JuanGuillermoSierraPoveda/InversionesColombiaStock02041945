import { formatCurrency, formatPercent } from "../js/utils.js";

const STOCKS = [
  { ticker: "MSFT", name: "Microsoft Corporation", market: "NASDAQ", price: 423.45, change: 1.74 },
  { ticker: "NVDA", name: "NVIDIA Corporation", market: "NASDAQ", price: 912.22, change: 2.88 },
  { ticker: "NU", name: "Nu Holdings (Nubank)", market: "NYSE", price: 12.7, change: -0.94 },
  { ticker: "EC", name: "Ecopetrol S.A.", market: "NYSE / BVC", price: 11.02, change: 0.63 },
  { ticker: "CIBEST", name: "Grupo Cibest", market: "BVC Colombia", price: 8.15, change: 0.41 },
];

function stockCard(stock) {
  const isUp = stock.change >= 0;
  return `
    <article class="card stack-sm">
      <div>
        <strong>${stock.ticker}</strong>
        <p class="muted">${stock.name}</p>
      </div>
      <p>${stock.market}</p>
      <p><strong>${formatCurrency(stock.price)}</strong></p>
      <span class="badge ${isUp ? "badge-up" : "badge-down"}">${formatPercent(stock.change)}</span>
      <p class="muted">Relevancia: exposición sectorial y diversificación para inversores colombianos.</p>
    </article>
  `;
}

export function createStocksPage() {
  return {
    render() {
      return `
        <section class="page fade-in stack-md">
          <header class="section">
            <h2>Las 5 acciones clave</h2>
            <p class="muted">
              Referencias educativas con datos simulados para análisis de contexto.
            </p>
          </header>
          <section class="card-grid">
            ${STOCKS.map(stockCard).join("")}
          </section>
        </section>
      `;
    },
    init() {},
  };
}
