/**
 * Punto de entrada: inicializa las tarjetas de countdown y actualiza cada segundo.
 */
import { CONFIG } from './config.js';
import { initCards, updateAllCards } from './dom.js';

const TICK_MS = 1000;

function showError(message) {
  const container = document.getElementById('countdown-cards');
  if (!container) return;
  const loading = document.getElementById('countdown-loading');
  if (loading) loading.remove();
  const p = document.createElement('p');
  p.className = 'countdown-error';
  p.innerHTML = message;
  container.appendChild(p);
}

function main() {
  try {
    const cardMap = initCards(CONFIG.countdowns);
    updateAllCards(cardMap, CONFIG.countdowns);
    setInterval(() => updateAllCards(cardMap, CONFIG.countdowns), TICK_MS);
  } catch (err) {
    showError(
      '<strong>No se pudieron cargar los countdowns.</strong> Abre esta página con un servidor local, no con <code>file://</code>. Por ejemplo: <code>npx serve</code> o <code>python -m http.server</code> en la carpeta del proyecto.'
    );
    console.error(err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
