# Redline Outpost — Implementation Plan

## Scope and implementation approach

Create a credit-conscious, static browser game prototype whose behavioral source of truth is the attached ARES-7 v3: Junior Astronaut Mission Trainer PDF. It is a deterministic seven-Sol Mars outpost power-allocation campaign for ages 7–12, with Cadet/Judge modes, a reliable Simple View and a synchronized procedural Three.js outpost. Keep the fixed campaign offline and independent of NASA network access; optional, explicitly initiated DONKI sync is available only in Practice + Judge and falls back cleanly to saved data.

The simulation and UI are client-side only. No server, login, account data, leaderboard, database, analytics, external art or paid asset generation. Keep the starter's Three.js/TypeScript/Vite toolchain, build-size budget, development Tweak bridge and tested starter modules. Persist only wrapped `redline.onboardingSeen` and `redline.bestStars` values in localStorage; never persist mission/user data. Use system fonts and original procedural meshes. Use feature-detected browser speech only; no audio files.

### Behavior boundaries

- Keep the exact initial values, seven-Sol schedule, discrete 5 kW plan rules, availability/battery legality, order of simulation updates, formula constants, clamping, status thresholds, stars, Engineering Debrief, replay snapshot semantics and Coach Hint from the PDF.
- Keep `src/sim/engine.ts` a pure deterministic transition with a structured trace. The fixed campaign is identical at Jezero and Elysium. A seeded PRNG drives separate optional practice scenarios only.
- Display the four reference plans and tests without changing the formulas. The PDF's EVEN table rounds displayed stocks to whole numbers; the simulation retains exact decimals (e.g. 25.25) and documents that table-rounding distinction instead of falsifying state.
- Use provenance labels for NASA measurements, simplified model values and normalized game units. Preserve PDF-listed event identifiers in technical mode only with a visible DONKI-pending warning; omit unsupported event/study claims. Mark the InSight elevation pending because its verified NASA link is only the Mars Trek portal, not the exact record. Do not include an uncited ISS value.
- Site and crop controls are educational only; crop values remain zero modifiers and fixed campaign schedule does not change. Practice-only live sync never alters the fixed campaign.
- Keep every core action operable from the Simple View/HUD if WebGL fails. In the 3D view, tap/click terrain to walk and tap/click a station to approach and focus its matching shared slider. Keyboard, mouse, touch sliders and ±5 buttons are synchronized.
- Include a replayable three-step briefing, per-Sol plain-language teaching, Judge formulas and verification flags, Why-Chain from the trace, replay, hints, read-aloud when supported, star results, best stars and print-friendly student and teacher reports.

## Project structure

- `src/main.ts` orchestrates campaign state, local storage keys, optional DONKI fetch, Tweak bridge, modal/visibility pause, keyboard input and the lightweight animation loop.
- `src/sim/engine.ts` owns exact simulation formulas, plan validation, trace and star/status helpers. `src/sim/scenarios.ts` owns the fixed campaign and seeded practice decks. `src/sim/rng.ts` is a deterministic PRNG.
- `src/data/nasaData.ts` stores data records with units, provenance, source URL and verification state. `src/data/sources.ts` stores the seven public source references, two linked NGSS performance expectations and the scope each actually supports.
- `src/ui/ui.ts` owns accessible, responsive HTML screens, controlled dialogs, provenance badges, gauges, teacher/source/data panels, results and speech. `src/styles/main.css` owns the PDF-aligned palette and layout.
- `src/scene/Scene.ts` is a low-poly procedural Mars pad, rover-cadet figure and three stations; it is presentation only and never owns simulation rules.
- `src/game/config.ts` gains only live outpost presentation defaults. `src/game/outpostTuning.ts` keeps preview Tweak controls tied to real movement/framing consumers; the starter tuning bridge remains intact.
- `tests/sim.test.ts` tests numerical references and core edge conditions. `scripts/smoke.mjs` retains the starter Playwright/headless smoke route, adapted to the mission flow.
- `assets/share/favicon.png` and `game-sharing.json` provide the original game-specific, hand-coded prototype icon. `LICENSE` is MIT. `public/manus-routes.json` registers the sole `/` route. The existing static Vite build remains `dist`.

## Design direction

The PDF supplies the visual direction, so arbitrary style sampling is unnecessary. **Design movement:** hard-edged Mars mission field console with NASA-era instrumentation cues, friendly rather than officially NASA-branded. **Core principles:** decision clarity; provenance beside values; Cadet readability with optional technical depth; equivalent accessible fallback controls.

**Color philosophy:** use the PDF palette: slate `#0F172A` grounds the console, off-white `#F8FAFC` creates calm working space, Mars orange `#EA580C` gives the game its own identity, solar gold `#EAB308` marks scarce power, emerald `#10B981` is nominal, and crimson `#EF4444` marks critical conditions. Pair color with text, symbols and stripe patterns.

**Layout paradigm:** asymmetric two-view field console: compact mission strip, stacked decision rail, and open pad view; on phones the outpost/accessible schematic sits above full-width controls. Avoid tiny dashboard tiles. **Signature elements:** orbital tri-station wordmark; instrument-edge dividers; striped resource meters and distinct station glyphs.

**Interaction philosophy:** direct and forgiving. Sliders and visible ±5 kW buttons are canonical; scene taps expose the same controls, and invalid battery plans are disabled with an explanation. **Animation:** restrained radiator rotation and local station feedback only, reduced-motion friendly, paused while hidden or a dialog is open. **Typography:** system sans stack only, large plain-language Cadet headlines, tabular numerals, legible technical details and no font downloads.

**Brand essence:** a Mars outpost trainer for junior cadets, teaching shared-power trade-offs through an interactive seven-Sol mission; steady, curious, candid. **Brand voice:** specific and encouraging, never calling game rules measured facts. Example lines: “Choose where the sunlight goes.” “Your crew, crops and shields share one power budget.” **Wordmark:** original REDLINE OUTPOST logotype and three-node orbit mark, also used as favicon. **Signature color:** Mars orange `#EA580C`.

## Delivery constraints

Use the existing static TypeScript/Three.js project; `pnpm build` produces `dist`. The fixed campaign must require no internet after load. The optional practice sync calls the official public DONKI endpoint from the browser only when requested and never substitutes live data into the fixed campaign. Cite each educational source in the in-game registry; label links according to what was actually checked. Do not claim unsupported study records, measurements, agency endorsement or verified event IDs. This is an educational simulation, not an official NASA or CSA product.
