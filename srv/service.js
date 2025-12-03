const cds = require('@sap/cds');
const { SELECT } = cds;
const WebSocket = require('ws');
const ENEMY_LIBRARY = require('../app/webapp/shared/enemyTypes.js');
const GAME_CONFIG = require('../app/webapp/shared/gameConfig.js');

const PLAYFIELD_WIDTH = 880;
const PLAYFIELD_HEIGHT = 500;
const PLAYER_LANE_Y = PLAYFIELD_HEIGHT - 40;
const PLAYER_STEP = 14;
const BOTTOM_THRESHOLD = PLAYFIELD_HEIGHT - 70;
const TICK_MS = 50;
const TICK_SEC = TICK_MS / 1000;

const WAVE_PLAN = [
  { types: ['STRESS_CLOUD', 'RUMOR_BUBBLE'], count: 10 },
  { types: ['STRESS_CLOUD', 'RUMOR_BUBBLE', 'DEADLINE_METEOR', 'TASK_OVERLOAD_SWARM'], count: 12 },
  { types: ['DEADLINE_METEOR', 'TASK_OVERLOAD_SWARM', 'PERFORMANCE_DUMP_CLOUD', 'IDOC_GHOST'], count: 14 },
  { types: ['BURNOUT_SHADOW', 'LEGACY_RFC_MONSTER', 'PERFORMANCE_DUMP_CLOUD', 'TRANSPORT_FREEZE_BLOB'], count: 10 }
];

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
const pickFromArray = arr => arr[Math.floor(Math.random() * arr.length)];
const ENEMY_SPEED_SCALE = parseFloat(
  process.env.ENEMY_SPEED_SCALE || (GAME_CONFIG?.enemy?.speedScale ?? 1)
);

const computeEnemySpeed = (type, wave = 1) => {
  const variance = type?.speedVariance || 0;
  const base = type?.baseSpeed || 70;
  const varianceFactor = variance ? 1 + (Math.random() * 2 - 1) * variance : 1;
  const waveFactor = 1 + Math.max(0, wave - 1) * 0.08;
  return Math.max(40, base * varianceFactor * waveFactor * ENEMY_SPEED_SCALE);
};

module.exports = cds.service.impl(async function () {
  const { Scores } = this.entities;

  // Aggregate scores for a given season
  this.on('TopSeasonPlayers', async req => {
    const { seasonID } = req.data;
    if (!seasonID) return [];

    const q = SELECT.from(Scores)
      .columns(
        'player_ID as playerID',
        { ref: ['player', 'name'], as: 'name' },
        { func: 'sum', args: [{ ref: ['points'] }], as: 'points' }
      )
      .groupBy('player_ID', { ref: ['player', 'name'] })
      .where({ match: { season_ID: seasonID } })
      .orderBy({ points: 'desc' })
      .limit(10);

    const db = await cds.connect.to('db');
    const rows = await db.run(q);
    return rows || [];
  });

  const attachWebSocket = httpServer => {
    console.log('[WS] Attempting to attach WebSocket server...');
    if (!httpServer) {
      console.error('[WS] Not started: missing HTTP server instance.');
      return false;
    }

    if (httpServer._goodVibesWssAttached) return true;
    httpServer._goodVibesWssAttached = true;

    const wss = new WebSocket.Server({ server: httpServer, path: '/ws/game' });
    console.log('[WS] WebSocket server attached at /ws/game');
    const rooms = new Map();

    const pickTypeForWave = wave => {
      const plan = WAVE_PLAN[(wave - 1) % WAVE_PLAN.length] || WAVE_PLAN[0];
      return pickFromArray(plan.types);
    };

    const createEnemy = room => {
      const typeId = pickTypeForWave(room.wave);
      const type = ENEMY_LIBRARY[typeId] || ENEMY_LIBRARY.STRESS_CLOUD;
      const baseX = clamp(30 + Math.random() * (PLAYFIELD_WIDTH - 60), 30, PLAYFIELD_WIDTH - 30);
      return {
        id: `e-${room.enemyCounter++}`,
        x: baseX,
        baseX,
        y: -20 - Math.random() * 50,
        alive: true,
        dir: 1,
        typeId,
        hp: type.maxHp || 1,
        maxHp: type.maxHp || 1,
        movementPattern: type.movementPattern || 'straight',
        scoreValue: type.scoreValue || 10,
        onReachBottomEffect: type.onReachBottomEffect,
        tier: type.tier || 1,
        speed: computeEnemySpeed(type, room.wave),
        phase: Math.random() * Math.PI * 2,
        spawnedAt: Date.now()
      };
    };

    const seedWave = room => {
      const wavePlan = WAVE_PLAN[(room.wave - 1) % WAVE_PLAN.length] || WAVE_PLAN[0];
      const baseCount = wavePlan.count || 10;
      const bonus = Math.max(0, room.wave - WAVE_PLAN.length);
      room.pendingSpawns = baseCount + bonus;
      room.lastSpawn = 0;
      room.spawnIntervalMs = Math.max(350, 900 - room.wave * 60);
      room.enemies = [];
    };

    const ensureRoom = roomId => {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          players: new Map(),
          enemies: [],
          wave: 1,
          mood: 100,
          enemyCounter: 0,
          pendingSpawns: 0,
          lastSpawn: 0,
          spawnIntervalMs: 900
        });
      }
      const room = rooms.get(roomId);
      if (room.enemies.length === 0 && room.pendingSpawns === 0) {
        seedWave(room);
      }
      return room;
    };

    const broadcastState = roomId => {
      const room = rooms.get(roomId);
      if (!room) return;
      const payload = JSON.stringify({
        type: 'state',
        players: Array.from(room.players.values()),
        enemies: room.enemies,
        wave: room.wave,
        teamMood: room.mood
      });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
          client.send(payload);
        }
      });
    };

    wss.on('connection', ws => {
      const clientId = `p-${Math.random().toString(36).slice(2, 8)}`;
      const roomId = 'default-room';
      const room = ensureRoom(roomId);

      room.players.set(clientId, {
        id: clientId,
        x: PLAYFIELD_WIDTH / 2,
        y: PLAYER_LANE_Y,
        score: 0,
        lives: 3,
        hp: 3,
        dir: 0,
        name: `Player-${clientId.slice(-3)}`
      });

      ws.clientId = clientId;
      ws.roomId = roomId;

      console.log(`WS client connected: ${clientId}`);

      ws.send(
        JSON.stringify({
          type: 'state',
          playerId: clientId,
          roomId,
          players: Array.from(room.players.values()),
          enemies: room.enemies,
          wave: room.wave,
          teamMood: room.mood
        })
      );

      ws.on('message', data => {
        let msg;
        try {
          msg = JSON.parse(data);
        } catch (e) {
          return;
        }

        const player = room.players.get(clientId);
        if (!player) return;

        if (msg.type === 'move') {
          const step = PLAYER_STEP;
          const dx = typeof msg.dx === 'number' ? msg.dx : typeof msg.dir === 'number' ? msg.dir : 0;
          player.x = clamp((player.x || PLAYFIELD_WIDTH / 2) + step * dx, 20, PLAYFIELD_WIDTH - 20);
          player.y = PLAYER_LANE_Y;
          player.dir = dx;
          player.moveDir = dx;
        }

        if (msg.type === 'hitEnemy' && msg.enemyId) {
          const enemy = room.enemies.find(e => e.id === msg.enemyId);
          if (enemy && enemy.alive) {
            const type = ENEMY_LIBRARY[enemy.typeId] || {};
            const damage = Math.max(1, msg.damage || 1);
            enemy.hp = Math.max(0, (enemy.hp ?? enemy.maxHp ?? 1) - damage);
            if (enemy.hp <= 0) {
              enemy.alive = false;
              enemy.diedAt = Date.now();
              player.score = (player.score || 0) + (enemy.scoreValue || type.scoreValue || 10);
            }
          }
        }
      });

      ws.on('close', () => {
        room.players.delete(clientId);
        console.log(`WS client disconnected: ${clientId}`);
      });
    });

    // Simple enemy movement + broadcast loop
    setInterval(() => {
      const now = Date.now();
      rooms.forEach((room, roomId) => {
        if (room.pendingSpawns > 0 && (!room.lastSpawn || now - room.lastSpawn >= room.spawnIntervalMs)) {
          room.enemies.push(createEnemy(room));
          room.pendingSpawns -= 1;
          room.lastSpawn = now;
        }

        room.enemies.forEach(enemy => {
          if (!enemy.alive) return;
          const type = ENEMY_LIBRARY[enemy.typeId] || {};
          const t = (now - (enemy.spawnedAt || now)) / 1000;
          enemy.y = (enemy.y ?? -20) + enemy.speed * TICK_SEC;
          let offsetX = 0;
          if (enemy.movementPattern === 'sine') {
            offsetX = Math.sin(t * 2.4 + (enemy.phase || 0)) * 36;
          } else if (enemy.movementPattern === 'zigzag') {
            const zigDir = Math.floor(t / 0.65) % 2 === 0 ? 1 : -1;
            offsetX = zigDir * 28;
          } else if (enemy.movementPattern === 'dash') {
            enemy.y += enemy.speed * 0.18 * TICK_SEC;
            const zigDir = Math.floor(t / 0.5) % 2 === 0 ? 1 : -1;
            offsetX = zigDir * 22;
          } else if (enemy.movementPattern === 'blink') {
            if (!enemy.lastBlink || now - enemy.lastBlink > 700) {
              enemy.lastBlink = now;
              enemy.baseX = clamp((enemy.baseX || enemy.x) + (Math.random() > 0.5 ? 60 : -60), 30, PLAYFIELD_WIDTH - 30);
            }
          }
          enemy.x = clamp((enemy.baseX || enemy.x) + offsetX, 20, PLAYFIELD_WIDTH - 20);

          if (enemy.y >= BOTTOM_THRESHOLD) {
            enemy.alive = false;
            enemy.breached = true;
            enemy.diedAt = now;
            const moodHit = 6 + (type.tier || 1) * 2;
            room.mood = clamp(room.mood - moodHit, 0, 100);
          }
        });

        room.enemies = room.enemies.filter(e => e.alive || now - (e.diedAt || now) < 2000);

        if (room.pendingSpawns === 0 && room.enemies.every(e => !e.alive)) {
          room.wave += 1;
          seedWave(room);
        }

        broadcastState(roomId);
      });
    }, TICK_MS);

    return true;
  };

  cds.once('listening', ({ server }) => {
    const ok = attachWebSocket(server);
    if (!ok && cds.app?._server) {
      attachWebSocket(cds.app._server);
    }
  });
});
