/**
 * GoodVibesGame - Refactored
 * A Phaser 3 Multiplayer Arcade Game
 */
(function () {
  // ==========================================
  // 1. CONFIGURATION & CONSTANTS
  // ==========================================
  const DEFAULT_CONFIG = {
    arena: {
      width: 880,
      height: 500,
      backgroundColor: '#000000',
    },
    player: {
      laneOffset: 40,
      laneMargin: 32,
      moveSpeed: 320,
      projectileSpeed: 520,
      shootCooldownMs: 180,
      scale: 1,
    },
    enemy: {
      bottomThresholdOffset: 70,
      scale: 1,
      speedScale: 1,
      boundsMargin: 28,
      baseSpeed: 70,
      spawnMarginX: 36,
    },
    visuals: {
      statusColor: '#88e2ff',
      statusFontSize: '13px',
      floatingTextColor: '#ffffff',
      damageColor: '#ff7777',
      goldColor: '#ffe36e',
    }
  };

  // ==========================================
  // 2. UTILITY HELPER FUNCTIONS
  // ==========================================
  const Utils = {
    /** Converts a list of objects with IDs into a map { id: object } */
    mapById(list) {
      const map = {};
      if (Array.isArray(list)) {
        list.forEach(item => {
          if (item?.id != null) map[item.id] = item;
        });
      }
      return map;
    },

    /** clamps a value between min and max */
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    /** Determines cardinal direction vector from input vector */
    getCardinalDirection(dir) {
      if (!dir) return { x: 0, y: -1 };
      const ax = Math.abs(dir.x || 0);
      const ay = Math.abs(dir.y || 0);
      if (ax === 0 && ay === 0) return { x: 0, y: -1 };
      if (ax > ay) return { x: dir.x > 0 ? 1 : -1, y: 0 };
      // Default to vertical preference on ties
      return { x: 0, y: dir.y >= 0 ? 1 : -1 };
    }
  };

  // ==========================================
  // 3. ANIMATION MANAGER
  // ==========================================
  class AnimationHelper {
    constructor(scene) {
      this.scene = scene;
    }

    loadSpriteSheets(types) {
      Object.values(types).forEach(type => {
        const sheets = type?.spriteSheets || {};
        // Load entity sheets
        Object.values(sheets).forEach(sheet => this.loadSingleSheet(sheet));
        
        // Load projectile sheets if they exist
        const proj = type?.projectile;
        if (proj) this.loadSingleSheet(proj);
      });
    }

    loadSingleSheet(sheet) {
      if (!sheet?.spriteKey || !sheet?.file || !sheet.frameWidth) return;
      this.scene.load.spritesheet(sheet.spriteKey, sheet.file, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight
      });
    }

    createAnimations(types, category) {
      Object.values(types).forEach(type => {
        // 1. Process standard sprite sheets
        const sheets = type?.spriteSheets || {};
        Object.values(sheets).forEach(sheet => {
          this.createSingleAnim(sheet.animKey, sheet.spriteKey, sheet.frameCount, sheet.frameRate, sheet.repeat);
        });

        // 2. Process specific enemy animations (idle, hit, death mappings)
        if (category === 'enemy') {
          this.createEnemySpecificAnims(type, sheets);
        }

        // 3. Process projectile animations
        const proj = type?.projectile;
        if (proj) {
          this.createSingleAnim(proj.animKey, proj.spriteKey, proj.frameCount, proj.frameRate || 10, proj.repeat);
        }
      });
    }

    createSingleAnim(key, spriteKey, frameCount, frameRate = 6, repeat = -1) {
      if (!key || !spriteKey) return;
      const endFrame = (frameCount || 1) - 1;
      this.scene.anims.create({
        key: key,
        frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: endFrame }),
        frameRate: frameRate,
        repeat: repeat
      });
    }

    createEnemySpecificAnims(type, sheets) {
      if (type.anim?.idle && sheets.idle) this.createSingleAnim(type.anim.idle, sheets.idle.spriteKey, sheets.idle.frameCount, 6, -1);
      if (type.anim?.hit && sheets.hit) this.createSingleAnim(type.anim.hit, sheets.hit.spriteKey, sheets.hit.frameCount, 12, 0);
      if (type.anim?.death && sheets.death) this.createSingleAnim(type.anim.death, sheets.death.spriteKey, sheets.death.frameCount, 10, 0);
    }
  }

  // ==========================================
  // 4. MAIN GAME SCENE
  // ==========================================
  class MainScene extends Phaser.Scene {
    constructor(onHitEnemy) {
      super('MainScene');
      this.onHitEnemyCallback = onHitEnemy;
      
      // Global Config
      this.cfg = window.GAME_CONFIG || {};
      this.arenaWidth = this.cfg.arenaWidth ?? DEFAULT_CONFIG.arena.width;
      this.arenaHeight = this.cfg.arenaHeight ?? DEFAULT_CONFIG.arena.height;

      // Layout Calculations
      this.layout = {
        playerY: this.arenaHeight - (this.cfg.player?.laneOffset ?? DEFAULT_CONFIG.player.laneOffset),
        bottomThreshold: this.arenaHeight - (this.cfg.enemy?.bottomThresholdOffset ?? DEFAULT_CONFIG.enemy.bottomThresholdOffset),
        playerLaneMargin: this.cfg.player?.laneMargin ?? DEFAULT_CONFIG.player.laneMargin,
        enemyBoundsMargin: this.cfg.enemy?.boundsMargin ?? DEFAULT_CONFIG.enemy.boundsMargin
      };

      // Game State
      this.gameState = {
        players: {},
        enemies: {}, // Server state
        enemyRuntime: {}, // Local interpolations/sprites
        projectiles: [],
        teamMood: 100,
        waveIndex: 1,
        playerId: null,
      };

      // Metadata & Caches
      this.meta = {
        enemyTypes: window.ENEMY_TYPES || {},
        playerTypes: window.PLAYER_TYPES || {},
        playerTypeById: {},
        enemyTypeById: {},
        lastShotTimes: {},
        playerShotState: {},
        playerSprites: {} // { sprite, type, lastX, ... }
      };
      
      this.animationHelper = new AnimationHelper(this);
    }

    // --- PHASER LIFECYCLE ---

    preload() {
      this.animationHelper.loadSpriteSheets(this.meta.enemyTypes);
      this.animationHelper.loadSpriteSheets(this.meta.playerTypes);
    }

    create() {
      this.setupInput();
      this.setupUI();
      this.animationHelper.createAnimations(this.meta.enemyTypes, 'enemy');
      this.animationHelper.createAnimations(this.meta.playerTypes, 'player');
    }

    update(time, delta) {
      const dt = delta || 0;
      this.handlePlayerInput(time, dt);
      this.renderPlayers();
      this.updateEnemies(time, dt); // Handles logic + render
      this.updateProjectiles(time, dt);
      this.updateUI();
    }

    // --- INPUT HANDLING ---

    setupInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.lastMoveSent = 0;
    }

    handlePlayerInput(time, delta) {
      if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) return;
      
      // 1. Movement
      const moveX = this.cursors.left.isDown ? -1 : this.cursors.right.isDown ? 1 : 0;
      const me = this.gameState.players[this.gameState.playerId];
      
      if (me && moveX !== 0) {
        // Local prediction
        const speed = this.cfg.player?.moveSpeed ?? DEFAULT_CONFIG.player.moveSpeed;
        const nextX = Utils.clamp(
          (me.x || this.arenaWidth / 2) + moveX * speed * (delta / 1000),
          this.layout.playerLaneMargin,
          this.scale.width - this.layout.playerLaneMargin
        );
        me.x = nextX;
        me.y = this.layout.playerY;

        // Network throttling
        if (time - this.lastMoveSent > 100) {
          this.wsConnection.send(JSON.stringify({ type: 'move', dx: moveX, dy: 0, dir: moveX }));
          this.lastMoveSent = time;
        }
      }

      // 2. Shooting
      const cooldown = this.cfg.player?.shootCooldownMs ?? DEFAULT_CONFIG.player.shootCooldownMs;
      const lastShot = this.meta.lastShotTimes[this.gameState.playerId] || 0;
      
      if (this.spaceKey?.isDown && time - lastShot >= cooldown && me) {
        const type = this.getTypeForPlayer(this.gameState.playerId);
        this.spawnProjectile(me, type, true);
        this.meta.lastShotTimes[this.gameState.playerId] = time;
        this.meta.playerShotState[this.gameState.playerId] = true;
      } else if (this.spaceKey?.isUp) {
        this.meta.playerShotState[this.gameState.playerId] = false;
      }
    }

    // --- UI & HUD ---

    setupUI() {
      this.add.text(10, 10, 'Left/Right to slide | Space to fire', {
        fontFamily: 'Arial', fontSize: '14px', color: '#ffffff'
      });
      const visualCfg = this.cfg.visuals || DEFAULT_CONFIG.visuals;
      this.statusText = this.add.text(10, 30, '', {
        fontFamily: 'Arial',
        fontSize: visualCfg.statusFontSize,
        color: visualCfg.statusColor
      });
    }

    updateUI() {
      if (!this.statusText) return;
      this.statusText.setText(`Wave ${this.gameState.waveIndex} | Team Mood ${Math.round(this.gameState.teamMood)}`);
    }

    showFloatingText(text, x, y, color = '#ffffff') {
      const label = this.add.text(x, y, text, {
        fontFamily: 'Arial', fontSize: '16px', color
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: label,
        y: y - 30,
        alpha: 0,
        duration: 1200,
        ease: 'Sine.easeOut',
        onComplete: () => label.destroy()
      });
    }

    // --- PLAYER SYSTEM ---

    renderPlayers() {
      const playerIds = Object.keys(this.gameState.players);
      
      playerIds.forEach(id => {
        const data = this.gameState.players[id];
        const type = this.getTypeForPlayer(id);
        const xPos = Utils.clamp(data.x || 0, this.layout.playerLaneMargin, this.arenaWidth - this.layout.playerLaneMargin);
        
        // Initialize sprite if missing
        if (!this.meta.playerSprites[id]) {
          this.createPlayerSprite(id, xPos, type);
        }

        const entry = this.meta.playerSprites[id];
        this.updatePlayerSpritePosition(entry, xPos);
        this.updatePlayerAnimation(entry, data, type);
        this.handleRemoteShooting(id, data, type);
      });

      // Cleanup disconnected players
      Object.keys(this.meta.playerSprites).forEach(id => {
        if (!this.gameState.players[id]) {
          this.meta.playerSprites[id].sprite.destroy();
          delete this.meta.playerSprites[id];
        }
      });
    }

    createPlayerSprite(id, x, type) {
      let sprite;
      const defaultSheet = type?.spriteSheets?.idle;
      if (defaultSheet && this.textures.exists(defaultSheet.spriteKey)) {
        sprite = this.add.sprite(x, this.layout.playerY, defaultSheet.spriteKey).setOrigin(0.5, 1);
        sprite.setScale(this.cfg.player?.scale ?? DEFAULT_CONFIG.player.scale);
      } else {
        sprite = this.add.rectangle(x, this.layout.playerY, 24, 32, 0x4caf50);
      }
      
      // Highlight self
      if (id === this.gameState.playerId) sprite.setTint(0xffffff);
      
      this.meta.playerSprites[id] = { 
        sprite, 
        type, 
        lastX: x, 
        prevX: x, 
        isSelf: id === this.gameState.playerId 
      };
    }

    updatePlayerSpritePosition(entry, targetX) {
      // Simple Linear Interpolation (Lerp) for smoothness
      const currentX = entry.sprite.x || 0;
      const newX = Math.abs(currentX - targetX) < 1 
        ? targetX 
        : Phaser.Math.Linear(currentX, targetX, 0.35);
      
      entry.prevX = currentX;
      entry.sprite.x = newX;
      entry.sprite.y = this.layout.playerY;
      entry.lastX = targetX;
    }

    updatePlayerAnimation(entry, data, type) {
      // Determine animation based on state (alive, hit, shoot, walk, idle)
      const sheets = type?.spriteSheets || {};
      let animKey = sheets.idle?.animKey;

      if (data.alive === false && sheets.defeat) animKey = sheets.defeat.animKey;
      else if ((data.isHit || data.action === 'hit') && sheets.hit) animKey = sheets.hit.animKey;
      else if ((data.isShooting || data.action === 'shoot') && sheets.shoot) animKey = sheets.shoot.animKey;
      else {
        // Determine movement direction
        const dx = (entry.sprite.x) - (entry.prevX || 0);
        const dir = Math.abs(dx) > 0.5 ? Math.sign(dx) : (data.dir || 0);
        
        if (dir < 0 && sheets.walkLeft) animKey = sheets.walkLeft.animKey;
        if (dir > 0 && sheets.walkRight) animKey = sheets.walkRight.animKey;
      }

      if (animKey && entry.sprite.anims && entry.sprite.anims.getName() !== animKey) {
        if (this.anims.exists(animKey)) entry.sprite.play(animKey, true);
      }
    }

    handleRemoteShooting(id, data, type) {
      const shootingNow = !!(data?.isShooting || data?.action === 'shoot');
      const wasShooting = !!this.meta.playerShotState[id];
      
      if (shootingNow && !wasShooting) {
        // Trigger projectile for remote player
        this.spawnProjectile(data, type, id === this.gameState.playerId);
      }
      this.meta.playerShotState[id] = shootingNow;
    }

    // --- ENEMY SYSTEM ---

    updateEnemies(time, delta) {
      const serverEnemies = Object.values(this.gameState.enemies || {});
      const seenIds = new Set();
      const deltaSec = delta / 1000;

      serverEnemies.forEach(data => {
        if (!data || data.id == null) return;
        seenIds.add(String(data.id));

        const type = this.getTypeForEnemy(data.id, data);
        const isDeadOnServer = data.alive === false || (data.hp !== undefined && data.hp <= 0);
        let runtimeEnemy = this.gameState.enemyRuntime[data.id];

        // 1. Spawn new enemy
        if (!runtimeEnemy) {
          if (isDeadOnServer) return; // Don't spawn dead things
          runtimeEnemy = this.spawnEnemy(data, type);
        }

        // 2. Sync state
        runtimeEnemy.type = type;
        if (data.hp !== undefined && data.hp < runtimeEnemy.hp && runtimeEnemy.status === 'alive') {
          runtimeEnemy.hp = data.hp;
          this.playEnemyHit(data.id);
        }

        // 3. Handle Death
        if (isDeadOnServer && runtimeEnemy.status === 'alive') {
          this.killEnemy(data.id);
        }

        // 4. Update Movement & Logic
        if (runtimeEnemy.status === 'alive') {
          this.moveEnemy(runtimeEnemy, deltaSec);
          // Check for breach (reaching bottom)
          if (runtimeEnemy.y >= this.layout.bottomThreshold) {
            this.handleEnemyBreach(data.id, type);
          }
        }
      });

      // Cleanup removed enemies
      this.cleanupEnemies(seenIds);
    }

    spawnEnemy(data, type) {
      const baseSheetKey = type?.spriteSheets?.idle?.spriteKey || type.spriteKey;
      const sprite = this.add.sprite(0, 0, baseSheetKey).setOrigin(0.5).setScale(this.cfg.enemy?.scale ?? 1);
      
      if (type.anim?.idle && this.anims.exists(type.anim.idle)) sprite.play(type.anim.idle);

      const margin = DEFAULT_CONFIG.enemy.spawnMarginX;
      const spawnX = Utils.clamp(data.x ?? (margin + Math.random() * (this.arenaWidth - margin * 2)), margin, this.arenaWidth - margin);
      const spawnY = data.y ?? (-Math.random() * 60 - 20);

      const speedFactor = (type.baseSpeed || 70) * (this.cfg.enemy?.speedScale ?? 1);
      const randomVar = type.speedVariance ? 1 + (Math.random() * 2 - 1) * type.speedVariance : 1;

      const runtimeData = {
        sprite,
        type,
        hp: data.hp ?? type.maxHp,
        status: 'alive',
        speed: Math.max(40, speedFactor * randomVar),
        baseX: spawnX,
        y: spawnY,
        pathPhase: Math.random() * Math.PI * 2,
        spawnedAt: this.time.now,
        id: data.id
      };
      
      sprite.setPosition(spawnX, spawnY);
      this.gameState.enemyRuntime[data.id] = runtimeData;
      return runtimeData;
    }

    moveEnemy(rt, deltaSec) {
      const t = (this.time.now - rt.spawnedAt) / 1000;
      const pattern = rt.type.movementPattern || 'straight';
      
      rt.y = (rt.y ?? -20) + rt.speed * deltaSec;
      
      // Movement Patterns
      let offsetX = 0;
      if (pattern === 'sine') {
        offsetX = Math.sin(t * 2.5 + rt.pathPhase) * 36;
      } else if (pattern === 'zigzag') {
        const step = Math.floor(t / 0.65) % 2 === 0 ? 1 : -1;
        offsetX = step * 28;
      } else if (pattern === 'dash') {
        rt.y += rt.speed * 0.28 * deltaSec; // Extra speed
        const step = Math.floor(t / 0.45) % 2 === 0 ? 1 : -1;
        offsetX = step * 18;
      }

      const finalX = Utils.clamp(rt.baseX + offsetX, this.layout.enemyBoundsMargin, this.arenaWidth - this.layout.enemyBoundsMargin);
      rt.sprite.setPosition(finalX, rt.y);
      
      // Update local storage of server state for consistency
      if (this.gameState.enemies[rt.id]) {
        this.gameState.enemies[rt.id].x = finalX;
        this.gameState.enemies[rt.id].y = rt.y;
      }
    }

    killEnemy(id) {
      const rt = this.gameState.enemyRuntime[id];
      if (!rt || rt.status === 'dead' || rt.status === 'dying') return;
      
      rt.status = 'dying';
      this.showKillMessage(rt.type);

      const onComplete = () => {
        if (this.gameState.enemyRuntime[id]) {
          this.gameState.enemyRuntime[id].sprite.destroy();
          delete this.gameState.enemyRuntime[id];
        }
      };

      if (rt.type?.anim?.death && this.anims.exists(rt.type.anim.death)) {
        rt.sprite.play(rt.type.anim.death);
        rt.sprite.once('animationcomplete', onComplete);
        this.time.delayedCall(1200, onComplete); // Failsafe
      } else {
        onComplete();
      }
    }

    playEnemyHit(id) {
      const rt = this.gameState.enemyRuntime[id];
      if (!rt || rt.status !== 'alive') return;
      
      if (rt.type?.anim?.hit && this.anims.exists(rt.type.anim.hit)) {
        rt.sprite.play(rt.type.anim.hit);
        rt.sprite.once('animationcomplete', () => {
          // Return to idle if still alive
          if (this.gameState.enemyRuntime[id]?.status === 'alive' && rt.type.anim?.idle) {
            rt.sprite.play(rt.type.anim.idle);
          }
        });
      }
    }

    cleanupEnemies(seenIds) {
      Object.keys(this.gameState.enemyRuntime).forEach(id => {
        if (!seenIds.has(String(id))) {
          const rt = this.gameState.enemyRuntime[id];
          if (rt && rt.status !== 'dying' && rt.status !== 'dead') {
            rt.sprite.destroy();
            delete this.gameState.enemyRuntime[id];
          }
        }
      });
    }

    handleEnemyBreach(id, type) {
      const penalty = type?.moodDamage ?? (6 + (type?.tier || 1) * 2);
      this.adjustTeamMood(-penalty, type?.onReachBottomEffect);
      
      // Remove locally immediately
      if (this.gameState.enemyRuntime[id]) {
        this.gameState.enemyRuntime[id].sprite.destroy();
        delete this.gameState.enemyRuntime[id];
      }
      delete this.gameState.enemies[id];
    }

    // --- PROJECTILE SYSTEM ---

    spawnProjectile(playerData, type, isLocal) {
      if (!playerData) return;
      
      const x = Utils.clamp(playerData.x || 0, this.layout.playerLaneMargin, this.arenaWidth - this.layout.playerLaneMargin);
      const projConfig = type?.projectile;
      const speed = this.cfg.player?.projectileSpeed ?? DEFAULT_CONFIG.player.projectileSpeed;
      
      let sprite;
      if (projConfig?.spriteKey && this.textures.exists(projConfig.spriteKey)) {
        sprite = this.add.sprite(x, this.layout.playerY - 20, projConfig.spriteKey).setOrigin(0.5, 1);
        if (projConfig.animKey) sprite.play(projConfig.animKey);
      } else {
        const color = Phaser.Display.Color.HexStringToColor(type?.primaryColor || '#ffffff').color;
        sprite = this.add.rectangle(x, this.layout.playerY - 20, 8, 16, color);
      }

      this.gameState.projectiles.push({
        sprite,
        vx: 0,
        vy: -speed,
        bornAt: this.time.now,
        ownerLocal: isLocal
      });
    }

    updateProjectiles(time, delta) {
      const dt = delta / 1000;
      const bounds = { w: this.arenaWidth, h: this.arenaHeight };

      this.gameState.projectiles = this.gameState.projectiles.filter(p => {
        p.sprite.x += p.vx * dt;
        p.sprite.y += p.vy * dt;

        // Collision Check
        const hitId = this.checkProjectileCollisions(p);
        if (hitId) {
          p.sprite.destroy();
          return false;
        }

        // Cleanup (Time or Bounds)
        const expired = time - p.bornAt > 1200;
        const out = p.sprite.x < -30 || p.sprite.x > bounds.w + 30 || p.sprite.y < -30 || p.sprite.y > bounds.h + 30;
        
        if (expired || out) {
          p.sprite.destroy();
          return false;
        }
        return true;
      });
    }

    checkProjectileCollisions(projectile) {
      const px = projectile.sprite.x;
      const py = projectile.sprite.y;

      for (const [id, rt] of Object.entries(this.gameState.enemyRuntime)) {
        if (rt.status !== 'alive') continue;

        const width = (rt.type.width || 22) * (this.cfg.enemy?.scale ?? 1);
        const height = (rt.type.height || 22) * (this.cfg.enemy?.scale ?? 1);

        if (Math.abs(rt.sprite.x - px) <= width / 2 && Math.abs(rt.sprite.y - py) <= height / 2) {
          if (projectile.ownerLocal) {
            this.handleLocalHit(id, rt);
          }
          return id; // Collision occurred
        }
      }
      return null;
    }

    handleLocalHit(id, rt) {
      if (typeof this.onHitEnemyCallback === 'function') {
        this.onHitEnemyCallback(id);
      }
      
      // Predict damage locally
      rt.hp = Math.max(0, rt.hp - 1);
      if (rt.hp <= 0) {
        const reward = rt.type.tier >= 3 ? 8 : (rt.type.tier === 2 ? 5 : 3);
        this.adjustTeamMood(reward);
        this.killEnemy(id);
      } else {
        this.playEnemyHit(id);
      }
    }

    // --- STATE HELPERS ---

    syncState(state) {
      if (state.playerId) this.gameState.playerId = state.playerId;
      if (typeof state.teamMood === 'number') this.gameState.teamMood = state.teamMood;
      if (typeof state.wave === 'number') this.gameState.waveIndex = state.wave;

      // Sync Players
      const pList = Array.isArray(state.players) ? state.players : [];
      this.gameState.players = Utils.mapById(pList);
      this.assignTypeToEntities(pList, 'player');

      // Sync Enemies
      const eList = Array.isArray(state.enemies) ? state.enemies : [];
      this.gameState.enemies = Utils.mapById(eList);
      this.assignTypeToEntities(eList, 'enemy');
    }

    /** Generic type assigner for both Players and Enemies */
    assignTypeToEntities(list, category) {
      const map = category === 'player' ? this.meta.playerTypeById : this.meta.enemyTypeById;
      const availableTypes = category === 'player' ? this.meta.playerTypes : this.meta.enemyTypes;
      const keys = Object.keys(availableTypes);
      if (keys.length === 0) return;

      let nextIndex = 0; // Simplified round-robin for fallback

      list.forEach(entity => {
        if (!entity || !entity.id || map[entity.id]) return;

        // Try to match specific requested type or color
        const requested = entity.typeId || entity.typeKey || entity.playerType;
        if (requested && availableTypes[requested]) {
          map[entity.id] = availableTypes[requested];
          return;
        }

        if (entity.color && category === 'player') {
          const match = Object.values(availableTypes).find(t => t.primaryColor?.toLowerCase() === entity.color.toLowerCase());
          if (match) {
            map[entity.id] = match;
            return;
          }
        }

        // Fallback: Round Robin
        map[entity.id] = availableTypes[keys[nextIndex % keys.length]];
        nextIndex++;
      });
    }

    getTypeForPlayer(id) {
      return this.meta.playerTypeById[id] || Object.values(this.meta.playerTypes)[0];
    }

    getTypeForEnemy(id, data) {
      // Priority: runtime ID -> data payload type -> stored ID -> fallback
      if (data?.typeId && this.meta.enemyTypes[data.typeId]) return this.meta.enemyTypes[data.typeId];
      if (this.meta.enemyTypeById[id]) return this.meta.enemyTypeById[id];
      return this.meta.enemyTypes.STRESS_CLOUD || Object.values(this.meta.enemyTypes)[0];
    }

    adjustTeamMood(delta, reason) {
      this.gameState.teamMood = Utils.clamp(this.gameState.teamMood + delta, 0, 100);
      if (reason) {
        this.showFloatingText(String(reason), this.arenaWidth / 2, this.layout.bottomThreshold - 20, DEFAULT_CONFIG.visuals.damageColor);
      }
    }

    showKillMessage(type) {
      const msgs = {
        LEGACY_RFC_MONSTER: 'Legacy RFC Monster refactored!',
        PERFORMANCE_DUMP_CLOUD: 'Performance dump cleared!',
        BURNOUT_SHADOW: 'Burnout shadow dispelled!'
      };
      const text = msgs[type?.id] || (type?.tier >= 3 ? 'Big bad energy defeated!' : null);
      
      if (text) {
        this.showFloatingText(text, this.arenaWidth / 2, this.arenaHeight / 3, DEFAULT_CONFIG.visuals.goldColor);
      }
    }
  }

  // ==========================================
  // 5. GLOBAL INTERFACE
  // ==========================================
  let gameInstance = null;
  let wsCleanup = null;

  window.GoodVibesGame = {
    start(ws, onHitEnemyCallback) {
      if (!ws) return console.error('WS Connection required');
      this.stop(); // Cleanup previous instance

      const scene = new MainScene(onHitEnemyCallback);
      const config = {
        type: Phaser.AUTO,
        width: scene.arenaWidth,
        height: scene.arenaHeight,
        backgroundColor: DEFAULT_CONFIG.arena.backgroundColor,
        parent: 'game-container',
        scene
      };

      gameInstance = new Phaser.Game(config);

      // CSS Variable Handoff
      const container = document.getElementById('game-container');
      if (container) {
        container.style.setProperty('--arena-width', scene.arenaWidth);
        container.style.setProperty('--arena-height', scene.arenaHeight);
      }

      // Attach WebSocket Listener
      const handler = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'state') scene.syncState(msg);
        } catch (e) { console.error('WS Error', e); }
      };
      ws.addEventListener('message', handler);
      
      // Store cleanup function
      wsCleanup = () => ws.removeEventListener('message', handler);
      
      // Pass connection to scene
      scene.wsConnection = ws;
    },

    stop() {
      if (wsCleanup) {
        wsCleanup();
        wsCleanup = null;
      }
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    }
  };
})();