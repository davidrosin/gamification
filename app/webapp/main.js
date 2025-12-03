(function () {
  const state = {
    players: [],
    enemies: [],
    playerId: null,
    connected: false,
    ws: null,
    hud: {
      health: 100,
      shield: 50,
      lives: 3,
      wave: 1,
      nextWaveMs: null
    }
  };

  const els = {
    nameInput: document.getElementById('nameInput'),
    joinBtn: document.getElementById('joinBtn'),
    scoreboardList: document.getElementById('scoreboardList'),
    connectedList: document.getElementById('connectedList'),
    enemyLegendList: document.getElementById('enemyLegendList'),
    hudHealth: document.getElementById('hudHealth'),
    hudShield: document.getElementById('hudShield'),
    hudLives: document.getElementById('hudLives'),
    hudWave: document.getElementById('hudWave'),
    hudNextWave: document.getElementById('hudNextWave')
  };

  function renderScoreboard() {
    if (!els.scoreboardList) return;
    const customName = (els.nameInput?.value || '').trim();
    const sorted = [...state.players].sort((a, b) => (b.score || 0) - (a.score || 0));
    els.scoreboardList.innerHTML = '';
    sorted.forEach(p => {
      const li = document.createElement('li');
      const isSelf = p.id === state.playerId;
      if (isSelf) li.classList.add('highlight');
      const displayName = isSelf && customName ? customName : p.name || p.id;
      li.textContent = `${displayName}: ${p.score || 0}`;
      els.scoreboardList.appendChild(li);
    });
  }

  function renderConnected() {
    if (!els.connectedList) return;
    const customName = (els.nameInput?.value || '').trim();
    const sorted = [...state.players].sort((a, b) => (a.name || a.id || '').localeCompare(b.name || b.id || ''));
    els.connectedList.innerHTML = '';
    sorted.forEach(p => {
      const li = document.createElement('li');
      const isSelf = p.id === state.playerId;
      if (isSelf) li.classList.add('highlight');
      const displayName = isSelf && customName ? customName : p.name || p.id;
      li.textContent = displayName;
      els.connectedList.appendChild(li);
    });
  }

  function renderEnemyLegend() {
    if (!els.enemyLegendList) return;
    const types = window.ENEMY_TYPES || {};
    const entries = Object.values(types);
    els.enemyLegendList.innerHTML = '';
    const thumbSize = 64;
    const thumbPadding = 10;
    entries.forEach(t => {
      const li = document.createElement('li');
      const idleSheet = t?.spriteSheets?.idle || {};
      const frameW = idleSheet.frameWidth || 48;
      const frameH = idleSheet.frameHeight || 48;
      const frameCount = idleSheet.frameCount || 1;
      const thumb = document.createElement('div');
      thumb.className = 'enemy-thumb';
      thumb.setAttribute('aria-label', t.displayName || t.id || 'Enemy');
      thumb.style.width = thumbSize + 'px';
      thumb.style.height = thumbSize + 'px';
      thumb.style.padding = thumbPadding + 'px';
      thumb.style.backgroundRepeat = 'no-repeat';
      thumb.style.backgroundPosition = 'center center';
      if (idleSheet.file) {
        thumb.style.backgroundImage = `url(${idleSheet.file})`;
      }
      const innerSize = thumbSize - thumbPadding * 2;
      const scale = Math.min(innerSize / frameW, innerSize / frameH);
      thumb.style.backgroundSize = frameW * frameCount * scale + 'px ' + frameH * scale + 'px';

      const textWrap = document.createElement('div');
      textWrap.className = 'legend-text';
      const title = document.createElement('strong');
      title.textContent = t.displayName || t.id || 'Enemy';
      const desc = document.createElement('span');
      desc.textContent = t.description || '';
      const meta = document.createElement('span');
      meta.className = 'legend-meta';
      const stats = [
        t.tier ? `Tier ${t.tier}` : null,
        t.maxHp != null ? `HP ${t.maxHp}` : null,
        t.scoreValue != null ? `${t.scoreValue} pts` : null,
        t.baseSpeed != null ? `Speed ${t.baseSpeed}` : null,
        t.movementPattern ? `${t.movementPattern}` : null
      ].filter(Boolean);
      meta.textContent = stats.join(' • ') || t.id || '';
      textWrap.appendChild(title);
      textWrap.appendChild(desc);
      textWrap.appendChild(meta);
      li.appendChild(thumb);
      li.appendChild(textWrap);
      els.enemyLegendList.appendChild(li);
    });
  }

  function renderHud() {
    if (els.hudHealth) els.hudHealth.textContent = state.hud.health;
    if (els.hudShield) els.hudShield.textContent = state.hud.shield;
    if (els.hudLives) els.hudLives.textContent = state.hud.lives;
    if (els.hudWave) els.hudWave.textContent = state.hud.wave;
    if (els.hudNextWave) {
      if (state.hud.nextWaveMs == null) {
        els.hudNextWave.textContent = '--';
      } else {
        const seconds = Math.max(0, Math.ceil(state.hud.nextWaveMs / 1000));
        els.hudNextWave.textContent = seconds + 's';
      }
    }
  }

  function handleStateMessage(msg) {
    if (msg.playerId) state.playerId = msg.playerId;
    if (Array.isArray(msg.players)) state.players = msg.players;
    if (Array.isArray(msg.enemies)) state.enemies = msg.enemies;
    if (typeof msg.wave === 'number') state.hud.wave = msg.wave;
    if (typeof msg.teamMood === 'number') state.hud.health = msg.teamMood;
    renderScoreboard();
    renderConnected();
    renderHud();
  }

  function connect() {
    const trimmedName = (els.nameInput?.value || '').trim();
    if (!trimmedName) return;
    if (state.ws && (state.ws.readyState === WebSocket.OPEN || state.ws.readyState === WebSocket.CONNECTING)) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/game`);
    state.ws = ws;

    ws.addEventListener('open', () => {
      state.connected = true;
      if (els.joinBtn) els.joinBtn.disabled = true;
      if (els.nameInput) els.nameInput.disabled = true;
      ws.send(JSON.stringify({ type: 'setName', name: trimmedName }));
      if (window.GoodVibesGame && typeof window.GoodVibesGame.start === 'function') {
        window.GoodVibesGame.start(ws, enemyId => {
          ws.send(JSON.stringify({ type: 'hitEnemy', enemyId }));
        });
      }
    });

    ws.addEventListener('message', evt => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'state') {
          handleStateMessage(msg);
        }
      } catch (err) {
        console.error('WS parse error', err);
      }
    });

    ws.addEventListener('close', () => {
      state.connected = false;
      state.ws = null;
      if (els.joinBtn) els.joinBtn.disabled = false;
      if (els.nameInput) els.nameInput.disabled = false;
      if (window.GoodVibesGame && typeof window.GoodVibesGame.stop === 'function') {
        window.GoodVibesGame.stop();
      }
    });
  }

  function wireEvents() {
    if (els.joinBtn) els.joinBtn.addEventListener('click', connect);
    if (els.nameInput) {
      els.nameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          connect();
        }
      });
    }
  }

  function startHudTimers() {
    // Simple placeholder countdown that resets when enemies are all cleared
    setInterval(() => {
      const aliveEnemies = state.enemies.filter(e => e.alive !== false).length;
      if (aliveEnemies === 0) {
        if (state.hud.nextWaveMs == null) {
          state.hud.nextWaveMs = 15000; // 15s until next wave (placeholder)
        } else {
          state.hud.nextWaveMs = Math.max(0, state.hud.nextWaveMs - 1000);
        }
      } else {
        state.hud.nextWaveMs = null;
      }
      renderHud();
    }, 1000);
  }

  renderEnemyLegend();
  renderScoreboard();
  renderConnected();
  renderHud();
  wireEvents();
  startHudTimers();
})();
