# CLAUDE.md - Our Naija

## What this is
**Our Naija** (formerly working title "Farm Naija") is a browser-based Nigerian agriculture-driven city-building and governance game. The player starts as a Community Leader, grows a Nigerian community through agriculture and food production, provides public services, then progresses to Local Government Chairman, Governor and finally President.

Core loop: **Agriculture -> Food -> Economy -> Public Services -> Population -> Development -> Political Leadership.**

## Tech stack
TypeScript, Vite, Phaser 4 (game world), React (non-game UI), Supabase/PostgreSQL (later), Vercel-compatible static deploy. Browser-first. No Flutter, Electron or native apps. Avoid new dependencies unless clearly needed.

## Architecture rules
- World is data-driven: `src/game/data/communityWorld.ts` defines buildings, farm plots, roads, resources, zones and decorations using types in `src/types/world.ts`. Do not hard-code objects inside scenes.
- Scenes render data; they do not own data. Add a building by adding data plus a draw function in `game/world/draw.ts`.
- State lives in `src/state/` (game, player, world stores). Phaser and React communicate only through these stores and `state/actions.ts`.
- One reusable `InfoPanel` serves every selectable entity via `EntityInfo`. Never create per-building panels.
- Leadership levels are configured in `src/config/leadership.ts`. All four exist; only COMMUNITY_LEADER is playable. Never rename them.
- Keep files small and modular. No `any`. Comments only where they add context.
- Never hard-code secrets. Only the Supabase anon key may appear in frontend code.

## Visual direction and Nigerian identity
Stylised, warm, colourful, modern 2D (oblique, isometric-inspired) strategy look. Recognisably Nigerian: corrugated rust/green roofs, concrete and terracotta compound houses, red-earth and tarred roads, palms and shade trees, market tarps, blue water tanks, boreholes, power poles and solar. Green is an accent, with earth tones and sparing gold. Not photoreal, not childish, not fantasy, not a stereotyped "African village", and not a copy of Township or any other game. Use only original or permissively licensed assets (Cycle 1 art is generated in code; icons are lucide-react).

## Current cycle
Cycle 14: Active-community monthly simulation plus a persisted day/time clock, responsive ambient activity, lightweight weather visuals, citizen petition/trust governance, centralized optional audio, player profile, achievements, and soft governance streaks. Cycle 11 top navigation and contextual side-panel interaction remain required.

## Prohibited shortcuts (until their cycle)
No taxation, government budgets, elections, politics, later levels, national map, multiplayer, monetisation or complex NPC AI. No "Coming Soon" screens. Do not fake systems. Do not turn this into a generic farming or African city-builder, or a satire.

Cycle 5 processing remains intentionally bounded: one persisted processing job runs at a time, facilities use data-driven recipes, storage and electricity checks are enforced, and processed products can be sold. Perishability, detailed farm-waste accounting, and multi-queue industrial logistics remain future work.

Cycle 6 deliberately stops at Local Government Chairman. Governor, state, national, party, corruption, multiplayer, and real-world political systems are not implemented.

Cycle 7 deliberately stops at one LGA. Ward projects and revenue are lightweight foundations; Governor elections, state maps, multiple LGAs, protests, inter-LGA trade, and national systems are not implemented.

Cycle 8 adds events through `src/game/data/events.ts`, `src/game/systems/events.ts`, and `eventStore`. Events advance by month, use rainy/dry/harmattan conditions and cooldowns, and resolve through existing gameplay metrics. Cycle 8 intentionally does not implement governor or presidential systems.

Cycle 9 adds the national administrative dataset in `src/game/data/nigeria.ts`, state metrics in `stateStore`, and Governor requirements/projects in `src/config/governor.ts`. Governor scope is limited to the player's original State. Presidential and federal systems remain future work.

Cycle 10 adds the browse-only national overview, contextual scope locks, and presidential foundation in `src/components/NigeriaOverview.tsx`, `src/config/president.ts`, and `src/components/PresidentPanel.tsx`. Do not add federal simulation, national taxation, or inter-state mechanics until their later cycle.

Cycle 11 moves secondary information into `src/components/SidePanel.tsx`. Keep the game world primary: use the side panel for navigation and summaries, and use existing detail panels for farm, market, building, processing, politics, events, state, Nigeria, and presidential interactions.

Cycle 12 runs the bounded active-community simulation in `src/game/systems/simulation.ts` when a month advances. Keep effects explainable, clamped, persisted, and data-driven. Do not simulate every Nigerian community in detail or add national taxation/full federal simulation.

Cycle 13 uses `src/game/systems/time.ts`, `src/game/systems/WorldAtmosphere.ts`, and the existing `AmbientLife` route system for visual life. Keep atmosphere and NPCs lightweight and visual-only; never let them intercept world hit-testing or replace existing building/farm interactions.

## Long-term game rules
1. Agriculture is the core economic engine.
2. Nigerian by design, not just by name.
3. Politics is progression, not decoration.
4. Public services connect to agricultural and economic development.
5. Four levels: Community Leader -> Local Government Chairman -> Governor -> President.
6. Levels unlock through gameplay achievements.
7. Players never pay to progress politically.
8. Monetisation: optional convenience, cosmetics, ads, partnerships.
9. Browser-first.
10. Stay modular enough to grow.

## Conventions
Strict TypeScript; run `npm run typecheck` and `npm run build` before finishing work. Deterministic world generation (seeded RNG). Mobile-first UI, 44px minimum tap targets, never convey information by colour alone.
