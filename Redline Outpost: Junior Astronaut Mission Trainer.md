# Redline Outpost: Junior Astronaut Mission Trainer

A working, browser-playable seven-Sol Mars power-planning prototype derived from the attached **ARES-7 v3** PDF. The PDF is the game's source of truth for its fictional campaign and simplified formulas. This educational simulation is not an official NASA or CSA product and does not claim to implement every Phase 3 feature in the specification.

## Run and verify

```bash
pnpm install
PORT=3000 HOST=0.0.0.0 pnpm dev --host 0.0.0.0 --port 3000
pnpm typecheck
pnpm test
pnpm build
pnpm smoke             # after a build; Playwright Chromium/Chrome
```

The build emits a static `dist/` directory. There is no project backend, account, database, or leaderboard. The fixed campaign works from local data after the page loads. Opening linked sources or choosing the optional DONKI button requires internet. DONKI is fetched directly from NASA's public API in Practice + Judge only; a saved-data fallback remains available if the request fails. The shipped `DEMO_KEY` is public and rate-limited; an optional `VITE_NASA_API_KEY` can be supplied locally.

## Mission controls

Start the fixed campaign or enter Practice with a reproducible seed. Pick Jezero or Elysium and a grow-tray conversation choice; neither changes the fixed campaign's science/game balance. Allocate power among Shield & Comms, Bio-Dome, and Habitat/ECLSS with 5 kW sliders or ±5 kW buttons. Mouse, touch, keyboard and the outpost view use the same controls. WASD/arrows move the cadet in the scene; Q/E changes the selected or nearby station, Space runs a Sol, H opens Coach Hint. Simple View always works if WebGL is unavailable. Browser speech is used only when supported.

Cadet mode favors short teaching lines. Judge mode exposes technical values, formulas, event provenance and the trace. After each Sol, Why-Chain shows the update order; replay restores the Sol-start stock and battery snapshot. Two replays are provided for the mission. Results include stars and a print-ready student report.

The Teacher & NGSS Guide includes five teaching tips, reflection prompts, the exact linked performance-expectation text for 3–5-ETS1-2 and MS-ETS1-2, and a print action. It is a discussion aid, not a standards assessment.

## Source-derived rules

The initial state is **85** oxygen/water, **80** food, **90** crew health, **0 mSv** cumulative dose, **30 kW** battery and **2** replays. Each station accepts 0–70 kW in steps of 5. Available power is campaign supply, reduced by 10 kW when previous-Sol crew health is below 65. A plan is legal when its excess load over availability does not exceed the remaining battery; battery draw is that excess.

Sol transitions follow the source order and keep fractional state: `daily dose = 0.64 × SEP × exp(−0.032 × shield kW)`; add dose to cumulative radiation; apply food output `(bio kW − 40) × 0.45`, multiplying positive output by 0.8 if Sol-start crew health was below 65; clamp food to 0–100; grant +6 when updated food is at least 65 and bio power at least 30, otherwise −5; on Sol 4 only, multiply a positive bonus by 1.5 when bio power is at least 40; update/clamp oxygen-water by `(hab kW − 40) × 0.55 + bonus`; calculate radiation penalty `max(0, dose − 1.10) × 8.5`, add scarcity penalties of 7 below 55 oxygen-water and 6 below 55 food; update/clamp crew health by `(hab kW − 40) × 0.45 − penalties`; finally subtract battery draw. Each step returns a provenance-labeled trace.

The PDF's EVEN reference table shows whole-number stocks (25 / 42 / 6); its equations retain the underlying fractional results (25.25 / 41.75 / 6.48). The numerical test rounds only those three display comparisons; it does not round simulation state. Other reference plans and dose checks are verified in `tests/sim.test.ts`. Stars require stocks/dose thresholds exactly as defined in `src/sim/engine.ts`.

## Data, trust and storage

`src/data/nasaData.ts` keeps numeric records with units, provenance, source and verification state. `src/data/sources.ts` lists the seven public resources named by the PDF and the two linked NGSS performance expectations; each link includes its scope limits. The NASA flare identifiers printed in ARES-7 remain visibly pending DONKI confirmation. The linked Mars Trek landing-site elevation values are identified as pending when the exact data record was not checked. The Curiosity RAD reference is 0.64 mSv/day at Gale Crater, not a site-specific landing measurement; the 6.5 mSv seven-Sol limit is a game budget, not a NASA crew-safety limit. X-ray class is not proton dose. Site and crop are educational choices only.

No mission state, entered seed or student identity is written to storage. The only localStorage keys are wrapped `redline.onboardingSeen` and `redline.bestStars`. There are no generated or downloaded gameplay assets or audio files: scene geometry and the small game-specific favicon are original procedural/code-drawn art. System fonts only. An MIT license is supplied in `LICENSE`.

## Layout

| Path | Role |
| --- | --- |
| `src/main.ts` | Client-side mission state, controls, replay, storage and optional practice sync |
| `src/sim/engine.ts`, `src/sim/scenarios.ts`, `src/sim/rng.ts` | Pure formulas, campaign/practice schedule and deterministic seeds |
| `src/data/nasaData.ts`, `src/data/sources.ts` | Provenance-tagged source records and citations |
| `src/ui/ui.ts`, `src/styles/main.css` | Cadet/Judge interface, accessible dialogs, responsive styling and report |
| `src/scene/Scene.ts` | Low-poly procedural outpost view; no simulation rules |
| `src/game/config.ts`, `src/game/outpostTuning.ts` | Live presentation tuning and the initialized development Tweak bridge |
| `tests/sim.test.ts`, `scripts/smoke.mjs` | Formula reference tests and end-to-end browser smoke test |
| `assets/share/favicon.png`, `game-sharing.json`, `LICENSE` | Small original favicon, sharing metadata and open-source license |

## Attributions

The Mission Trainer's narrative, schedule and simplified educational rules derive from the user-supplied ARES-7 v3 specification. In-game NASA and CSA source links provide further reading, not agency endorsement. Three.js is used under its MIT license; see `LICENSE` for this prototype.

## Verification

`pnpm typecheck`, all 88 unit tests, the production build and `pnpm smoke` pass. Browser smoke covers the seven-Sol mission and replay, Coach Hint in the report, source/NGSS links, the printable Teacher Guide, seeded Practice, timed Judge demo, mobile input and a forced WebGL failure. The production check reports 0.16 MB compressed transfer with unused starter fonts removed.
