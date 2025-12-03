// Centralized tuning knobs for the Good Vibes Defenders client.
// Adjust values here instead of hunting through the scene code.
window.GAME_CONFIG = {
  arenaWidth: 880,
  arenaHeight: 600,
  player: {
    laneOffset: 40,         // distance from bottom of screen
    laneMargin: 32,         // horizontal padding from edges
    moveSpeed: 100,         // pixels per second
    projectileSpeed: 520,   // pixels per second
    shootCooldownMs: 180,   // milliseconds
    scale: 0.75
  },
  enemy: {
    bottomThresholdOffset: 70, // distance from bottom that counts as a breach
    scale: 0.8,
    boundsMargin: 28,
    speedScale: 0.6 // global multiplier to slow/speed enemy movement
  },
  visuals: {
    statusColor: '#88e2ff',
    statusFontSize: '13px'
  }
};
