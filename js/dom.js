/**
 * Construcción y actualización del DOM de las tarjetas de countdown.
 * Usa el contenedor con id "countdown-cards" definido en el HTML.
 */

import { getTimeRemaining } from './countdown.js';
import { getAccessibleSummary, pad, pluralize } from './formatting.js';

const CONTAINER_ID = 'countdown-cards';

/**
 * Crea el HTML de una unidad de tiempo (número grande + etiqueta).
 * @param {string} value - Valor mostrado (ej. "03")
 * @param {string} label - Etiqueta (ej. "días")
 * @param {string} ariaLabel - Descripción para accesibilidad
 */
function createUnitBlock(value, label, ariaLabel) {
  const block = document.createElement('div');
  block.className = 'countdown-unit';
  block.setAttribute('role', 'group');
  block.setAttribute('aria-label', ariaLabel);
  block.innerHTML = `
    <span class="countdown-value" aria-hidden="true">${value}</span>
    <span class="countdown-label">${label}</span>
  `;
  return block;
}

/**
 * Actualiza o crea el contenido de una tarjeta según los datos del countdown.
 * @param {HTMLElement} card - Elemento de la tarjeta
 * @param {object} config - Elemento de CONFIG.countdowns
 * @param {ReturnType<getTimeRemaining>} data - Datos de getTimeRemaining
 */
function renderCardContent(card, config, data) {
  const titleEl = card.querySelector('.card-title');
  const descEl = card.querySelector('.card-description');
  const bodyEl = card.querySelector('.card-body');
  const summaryEl = card.querySelector('.countdown-summary');

  if (titleEl) titleEl.textContent = config.title;
  if (descEl) descEl.textContent = config.description;

  const summary = getAccessibleSummary(data, config.detailLevel);
  const unitsContainer = card.querySelector('.countdown-units');
  if (summaryEl) {
    summaryEl.textContent = summary;
    summaryEl.setAttribute('aria-live', 'polite');
  }

  if (data.passed) {
    if (unitsContainer) unitsContainer.innerHTML = '<p class="countdown-finished" role="status">¡Ya llegó la fecha!</p>';
    card.classList.add('countdown-finished');
    return;
  }

  card.classList.remove('countdown-finished');
  const fragment = document.createDocumentFragment();

  const units = [
    [String(data.years), pluralize(data.years, 'año', 'años'), `${data.years} ${pluralize(data.years, 'año', 'años')}`],
    [String(data.months), pluralize(data.months, 'mes', 'meses'), `${data.months} ${pluralize(data.months, 'mes', 'meses')}`],
    [pad(data.days), pluralize(data.days, 'día', 'días'), `${data.days} ${pluralize(data.days, 'día', 'días')}`],
    [pad(data.hours), 'h', `${data.hours} ${pluralize(data.hours, 'hora', 'horas')}`],
    [pad(data.minutes), 'min', `${data.minutes} ${pluralize(data.minutes, 'minuto', 'minutos')}`],
    [pad(data.seconds), 's', `${data.seconds} ${pluralize(data.seconds, 'segundo', 'segundos')}`],
  ];

  units.forEach(([value, label, ariaLabel]) => {
    fragment.appendChild(createUnitBlock(value, label, ariaLabel));
  });

  if (unitsContainer) {
    unitsContainer.innerHTML = '';
    unitsContainer.appendChild(fragment);
  }
}

/**
 * Crea el elemento tarjeta para un countdown y lo añade al contenedor.
 * @param {object} config - Elemento de CONFIG.countdowns
 * @returns {HTMLElement} La tarjeta creada
 */
function createCard(config) {
  const card = document.createElement('article');
  card.className = 'countdown-card';
  card.id = `card-${config.id}`;
  card.setAttribute('aria-labelledby', `title-${config.id}`);
  card.innerHTML = `
    <header class="card-header">
      <h2 id="title-${config.id}" class="card-title">${config.title}</h2>
      <p id="desc-${config.id}" class="card-description">${config.description}</p>
    </header>
    <div class="card-body" role="timer" aria-live="polite" aria-atomic="true">
      <p class="countdown-summary" aria-live="polite"></p>
      <div class="countdown-units"></div>
    </div>
  `;
  return card;
}

/**
 * Obtiene el contenedor de tarjetas o lanza si no existe.
 * @returns {HTMLElement}
 */
function getContainer() {
  const el = document.getElementById(CONTAINER_ID);
  if (!el) throw new Error(`Contenedor #${CONTAINER_ID} no encontrado.`);
  return el;
}

/**
 * Inicializa todas las tarjetas en el DOM y devuelve un mapa id -> card.
 * @param {Array} countdowns - CONFIG.countdowns
 * @returns {Map<string, HTMLElement>}
 */
function initCards(countdowns) {
  const container = getContainer();
  const loading = document.getElementById('countdown-loading');
  if (loading) loading.remove();
  const cardMap = new Map();
  countdowns.forEach((config) => {
    const card = createCard(config);
    container.appendChild(card);
    cardMap.set(config.id, card);
  });
  return cardMap;
}

/**
 * Actualiza todas las tarjetas con el tiempo actual.
 * @param {Map<string, HTMLElement>} cardMap - Mapa id -> card
 * @param {Array} countdowns - CONFIG.countdowns
 */
function updateAllCards(cardMap, countdowns) {
  const now = new Date();
  countdowns.forEach((config) => {
    const card = cardMap.get(config.id);
    if (!card || !config.targetDate) return;
    const data = getTimeRemaining(now, config.targetDate);
    renderCardContent(card, config, data);
  });
}

export { initCards, updateAllCards, getContainer };
