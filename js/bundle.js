/**
 * Bundle sin módulos para que funcione al abrir el HTML directamente (file://).
 * Incluye: config, countdown, formatting, dom y main.
 */
(function () {
  'use strict';

  // --- config.js ---
  var CONFIG = {
    birthDate: new Date(2009, 4, 19),
    countdowns: [
      { id: 'year-2027', title: 'Año 2027', description: 'Inicio del año 2027', targetDate: new Date(2027, 0, 1, 0, 0, 0), detailLevel: 'full' },
      { id: 'age-18', title: 'Mayor de edad (18 años)', description: 'Cumpleaños 18 — 19 de mayo', targetDate:, detailLevel: 'full' },
      { id: 'age-20', title: '20 años', description: 'Cumpleaños 20 — 19 de mayo', targetDate: null, detailLevel: 'full' },
      { id: 'age-25', title: '25 años', description: 'Cumpleaños 25 — 19 de mayo', targetDate: null, detailLevel: 'full' },
      { id: 'age-30', title: '30 años', description: 'Cumpleaños 30 — 19 de mayo', targetDate: null, detailLevel: 'full' },
      { id: 'year-2045', title: 'Año 2045', description: 'Inicio del año 2045', targetDate: new Date(2045, 0, 1, 0, 0, 0), detailLevel: 'full' },
    ],
  };
  function initConfig() {
    var birth = CONFIG.birthDate;
    CONFIG.countdowns.forEach(function (c) {
      if (c.id.indexOf('age-') === 0) {
        var age = parseInt(c.id.replace('age-', ''), 10);
        c.targetDate = new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate(), 0, 0, 0);
      }
    });
  }
  initConfig();

  // --- countdown.js ---
  function getTimeRemaining(from, to) {
    var totalMs = to.getTime() - from.getTime();
    var passed = totalMs <= 0;
    if (passed) {
      return { totalMs: 0, passed: true, years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 };
    }
    var seconds = Math.floor((totalMs / 1000) % 60);
    var minutes = Math.floor((totalMs / (1000 * 60)) % 60);
    var hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    var totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    var d = new Date(from.getTime());
    var years = 0, months = 0;
    while (true) {
      var nextYear = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
      if (nextYear > to) break;
      d = nextYear;
      years += 1;
    }
    while (true) {
      var nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
      if (nextMonth > to) break;
      d = nextMonth;
      months += 1;
    }
    var days = Math.floor((to.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return { totalMs: totalMs, passed: false, years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds, totalDays: totalDays };
  }

  // --- formatting.js ---
  function pluralize(count, singular, plural) {
    if (plural === undefined) plural = singular + 's';
    return count === 1 ? singular : plural;
  }
  function getAccessibleSummary(data, detailLevel) {
    if (detailLevel === undefined) detailLevel = 'full';
    if (data.passed) return 'Fecha ya alcanzada.';
    var parts = [];
    if (data.years) parts.push(data.years + ' ' + pluralize(data.years, 'año', 'años'));
    if (data.months) parts.push(data.months + ' ' + pluralize(data.months, 'mes', 'meses'));
    if (data.days) parts.push(data.days + ' ' + pluralize(data.days, 'día', 'días'));
    if (detailLevel === 'full') {
      if (data.hours) parts.push(data.hours + ' ' + pluralize(data.hours, 'hora', 'horas'));
      if (data.minutes) parts.push(data.minutes + ' ' + pluralize(data.minutes, 'minuto', 'minutos'));
      parts.push(data.seconds + ' ' + pluralize(data.seconds, 'segundo', 'segundos'));
    }
    return parts.length ? parts.join(', ') : 'Menos de un segundo';
  }
  function pad(n, length) {
    if (length === undefined) length = 2;
    return String(n).padStart(length, '0');
  }

  // --- dom.js ---
  var CONTAINER_ID = 'countdown-cards';
  function createUnitBlock(value, label, ariaLabel) {
    var block = document.createElement('div');
    block.className = 'countdown-unit';
    block.setAttribute('role', 'group');
    block.setAttribute('aria-label', ariaLabel);
    block.innerHTML = '<span class="countdown-value" aria-hidden="true">' + value + '</span><span class="countdown-label">' + label + '</span>';
    return block;
  }
  function renderCardContent(card, config, data) {
    var titleEl = card.querySelector('.card-title');
    var descEl = card.querySelector('.card-description');
    var summaryEl = card.querySelector('.countdown-summary');
    var unitsContainer = card.querySelector('.countdown-units');
    if (titleEl) titleEl.textContent = config.title;
    if (descEl) descEl.textContent = config.description;
    var summary = getAccessibleSummary(data, config.detailLevel);
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
    var fragment = document.createDocumentFragment();
    var units = [
      [String(data.years), pluralize(data.years, 'año', 'años'), data.years + ' ' + pluralize(data.years, 'año', 'años')],
      [String(data.months), pluralize(data.months, 'mes', 'meses'), data.months + ' ' + pluralize(data.months, 'mes', 'meses')],
      [pad(data.days), pluralize(data.days, 'día', 'días'), data.days + ' ' + pluralize(data.days, 'día', 'días')],
      [pad(data.hours), 'h', data.hours + ' ' + pluralize(data.hours, 'hora', 'horas')],
      [pad(data.minutes), 'min', data.minutes + ' ' + pluralize(data.minutes, 'minuto', 'minutos')],
      [pad(data.seconds), 's', data.seconds + ' ' + pluralize(data.seconds, 'segundo', 'segundos')],
    ];
    units.forEach(function (u) {
      fragment.appendChild(createUnitBlock(u[0], u[1], u[2]));
    });
    if (unitsContainer) {
      unitsContainer.innerHTML = '';
      unitsContainer.appendChild(fragment);
    }
  }
  function createCard(config) {
    var card = document.createElement('article');
    card.className = 'countdown-card';
    card.id = 'card-' + config.id;
    card.setAttribute('aria-labelledby', 'title-' + config.id);
    card.innerHTML = '<header class="card-header"><h2 id="title-' + config.id + '" class="card-title">' + config.title + '</h2><p id="desc-' + config.id + '" class="card-description">' + config.description + '</p></header><div class="card-body" role="timer" aria-live="polite" aria-atomic="true"><p class="countdown-summary" aria-live="polite"></p><div class="countdown-units"></div></div>';
    return card;
  }
  function getContainer() {
    var el = document.getElementById(CONTAINER_ID);
    if (!el) throw new Error('Contenedor #' + CONTAINER_ID + ' no encontrado.');
    return el;
  }
  function initCards(countdowns) {
    var container = getContainer();
    var loading = document.getElementById('countdown-loading');
    if (loading) loading.remove();
    var cardMap = new Map();
    countdowns.forEach(function (config) {
      var card = createCard(config);
      container.appendChild(card);
      cardMap.set(config.id, card);
    });
    return cardMap;
  }
  function updateAllCards(cardMap, countdowns) {
    var now = new Date();
    countdowns.forEach(function (config) {
      var card = cardMap.get(config.id);
      if (!card || !config.targetDate) return;
      var data = getTimeRemaining(now, config.targetDate);
      renderCardContent(card, config, data);
    });
  }

  // --- main.js ---
  var TICK_MS = 1000;
  function showError(message) {
    var container = document.getElementById('countdown-cards');
    if (!container) return;
    var loading = document.getElementById('countdown-loading');
    if (loading) loading.remove();
    var p = document.createElement('p');
    p.className = 'countdown-error';
    p.innerHTML = message;
    container.appendChild(p);
  }
  function main() {
    try {
      var cardMap = initCards(CONFIG.countdowns);
      updateAllCards(cardMap, CONFIG.countdowns);
      setInterval(function () {
        updateAllCards(cardMap, CONFIG.countdowns);
      }, TICK_MS);
    } catch (err) {
      showError('<strong>Error al cargar los countdowns.</strong> ' + err.message);
      console.error(err);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
