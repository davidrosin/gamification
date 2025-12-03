# Good Vibes Defenders

Multiplayer, Space-Invaders-style lane defender where chibi office heroes shoot positive vibes at falling workplace “bad energies”. Built with Phaser for rendering/game loop and a lightweight UI shell served by SAP CAP + WebSockets.

## Features
- Bottom-lane, horizontal-only player movement with upward-only shots and per-player projectile skins.
- Wave-based enemy spawns with distinct stats, HP, movement patterns (straight / sine / zigzag / dash / blink), and breach penalties to the Team Mood bar.
- Realtime multiplayer over WebSockets: see other players’ positions, shots, and shared enemy waves.
- Scoreboard, connected-player list, enemy legend, and HUD (mood/health, lives, wave info).
- Pixel-art sprite sheets with idle/hit/death animations for enemies and looping projectile animations for players.

## Tech Stack
- SAP CAP runtime (CDS) + Express server for static assets and WebSocket endpoint.
- Phaser 3 for the game loop and rendering.
- Vanilla JS UI shell (`main.js`) layered on the HTML/CSS scaffold.

## Getting Started
Prerequisites: Node 18+.

```bash
npm install
npm start   # runs `cds run` and hosts the webapp + WS server
# Open http://localhost:4004 (default CAP port) in your browser
```

For live reload of CAP endpoints and the static web app:
```bash
npm run watch
```

## Gameplay Basics
- Join: enter a name and click “Join Match”.
- Move: Arrow Left / Arrow Right (confined to the bottom lane).
- Shoot: Space (fires upward, rate-limited per player).
- Goal: prevent enemies from reaching the bottom; breaching hurts Team Mood. Clear waves to progress; each enemy awards points on defeat.

## Key Files
- `app/webapp/index.html` – page shell and HUD layout.
- `app/webapp/styles.css` – styling for the HUD, panels, and game surface.
- `app/webapp/main.js` – UI wiring, WebSocket connection, and HUD/scoreboard rendering.
- `app/webapp/phaserGame.js` – Phaser scene: player control, projectiles, enemy logic, animations, collisions, and mood tracking.
- `app/webapp/enemyTypes.js` – enemy roster with stats, movement patterns, and sprite sheets.
- `app/webapp/playerTypes.js` – player palette, animations, and projectile skins.
- `srv/service.js` – CAP service + WebSocket server: player/session management, enemy wave spawning, movement ticks, scoring, and state broadcasts.

## Enemy Roster (examples)
- Stress Cloud (tier 1, sine drift), Rumor Bubble (tier 1, zigzag), Deadline Meteor (tier 2, dash bursts), Task Overload Swarm (tier 1, zigzag), IDoc Ghost (tier 2, blink), Transport Freeze Blob (tier 2, sine), Performance Dump Cloud (tier 2, straight), Burnout Shadow (tier 3, straight), Legacy RFC Monster (tier 3, straight).

## Notes & Customization
- Adjust movement speeds, cooldowns, and mood penalties in `phaserGame.js` (client feel) and `srv/service.js` (authoritative wave logic).
- Add or tweak enemies in `enemyTypes.js` and mirror core stats in `srv/service.js` if you add new types.
- Assets live under `app/webapp/assets/`; keep sprite sheet dimensions in sync with the metadata in the type files.

## Troubleshooting
- If sprites don’t animate, verify the `spriteKey`/`animKey` names in `enemyTypes.js`/`playerTypes.js` match the loaded assets.
- Ensure the browser can reach the WS endpoint at `/ws/game`; CAP defaults to port 4004 unless configured otherwise.

## License
Internal demo project; no public license specified.
