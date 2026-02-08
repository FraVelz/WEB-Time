/**
 * Temporizador Pomodoro: trabajo 25 min, descanso corto 5 min, descanso largo 15 min.
 * Funciona sin módulos para compatibilidad con file://.
 */
(function () {
  'use strict';

  var WORK_SEC = 25 * 60;
  var SHORT_BREAK_SEC = 5 * 60;
  var LONG_BREAK_SEC = 15 * 60;
  var POMODOROS_FOR_LONG = 4;

  var state = {
    phase: 'work',   // 'work' | 'shortBreak' | 'longBreak'
    secondsLeft: WORK_SEC,
    totalSeconds: WORK_SEC,
    isRunning: false,
    pomodoroCount: 0,
    timerId: null,
  };

  var display = document.getElementById('pomodoro-display');
  var phaseLabel = document.getElementById('pomodoro-phase');
  var progressBar = document.getElementById('pomodoro-progress');
  var btnStart = document.getElementById('pomodoro-start');
  var btnPause = document.getElementById('pomodoro-pause');
  var btnReset = document.getElementById('pomodoro-reset');

  function pad(n) {
    return String(Math.floor(n)).padStart(2, '0');
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return pad(m) + ':' + pad(s);
  }

  function setPhase(phase) {
    state.phase = phase;
    if (phase === 'work') {
      state.totalSeconds = WORK_SEC;
      state.secondsLeft = WORK_SEC;
      if (phaseLabel) phaseLabel.textContent = 'Trabajo';
    } else if (phase === 'shortBreak') {
      state.totalSeconds = SHORT_BREAK_SEC;
      state.secondsLeft = SHORT_BREAK_SEC;
      if (phaseLabel) phaseLabel.textContent = 'Descanso corto';
    } else {
      state.totalSeconds = LONG_BREAK_SEC;
      state.secondsLeft = LONG_BREAK_SEC;
      if (phaseLabel) phaseLabel.textContent = 'Descanso largo';
    }
    updateUI();
  }

  function nextPhase() {
    if (state.phase === 'work') {
      state.pomodoroCount += 1;
      if (state.pomodoroCount >= POMODOROS_FOR_LONG) {
        state.pomodoroCount = 0;
        setPhase('longBreak');
      } else {
        setPhase('shortBreak');
      }
    } else {
      setPhase('work');
    }
  }

  function tick() {
    if (!state.isRunning) return;
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 0) {
      state.isRunning = false;
      if (state.timerId) clearInterval(state.timerId);
      state.timerId = null;
      nextPhase();
      if (btnStart) btnStart.textContent = 'Iniciar';
      return;
    }
    updateUI();
  }

  function updateUI() {
    if (display) display.textContent = formatTime(state.secondsLeft);
    if (progressBar) {
      var pct = state.totalSeconds ? ((state.totalSeconds - state.secondsLeft) / state.totalSeconds) * 100 : 0;
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }
    if (btnPause) btnPause.disabled = !state.isRunning;
  }

  function start() {
    if (state.isRunning) return;
    state.isRunning = true;
    if (btnStart) btnStart.textContent = 'Reanudar';
    state.timerId = setInterval(tick, 1000);
    tick();
  }

  function pause() {
    state.isRunning = false;
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    if (btnStart) btnStart.textContent = 'Iniciar';
    updateUI();
  }

  function reset() {
    pause();
    setPhase(state.phase);
  }

  if (btnStart) btnStart.addEventListener('click', start);
  if (btnPause) btnPause.addEventListener('click', pause);
  if (btnReset) btnReset.addEventListener('click', reset);

  setPhase('work');
})();
