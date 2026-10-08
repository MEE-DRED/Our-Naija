# Our Naija - Cycle 1

## Implemented
- Vite + TypeScript + React + Phaser 4 project, deployable as a static web app.
- Title screen (Play, Settings, About), loading screen, error boundary and error screen.
- Fictional community "Odo-Ewa" (40x30 tiles, data-driven): 9 compound houses, 7 farm plots, market, school, clinic, borehole, power transformer with solar, local government office, tarred and earth roads, drainage, power poles and wires, pond, palms, trees, shrubs, banana plants, roadside stalls.
- Camera: drag/touch pan, wheel and pinch zoom, bounds, keyboard pan.
- HUD (role, community, population, food security, treasury, development, happiness) with a compact mobile layout, and a community dashboard modal.
- Selection of buildings and farm plots with one reusable info panel.
- Leadership progression defined in config (all four levels; only Community Leader playable).
- Observable stores for game, player and world state; Supabase client module (inactive).

## Intentionally not implemented
Farming mechanics, economy, trading, politics, later levels, auth, persistence, NPCs, audio, monetisation.

## Known limitations
- **The project was written without network access, so `npm install`, `npm run build` and browser testing have NOT been run.** Expect to fix small type or API issues (especially Phaser 4 typings) on first build. Run `npm install && npm run typecheck && npm run build` first.
- No linter configured. Settings is a placeholder.
- Art is procedural and should be reviewed against the Nigerian reference set; labels use text, not custom signage art.
- Selection is by pointer; keyboard users can pan but cannot yet cycle through buildings.
- Camera position is not stored in state.

## Environment variables
None required. Optional: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (reserved).

## Recommended Cycle 2
Farm plot ownership and states, crops and growth timers, harvest and inventory, a minimal treasury ledger, and replacing mock HUD values with derived state.

## Visual pass (Layers 1-3, after Cycle 1 review)
- Environment: noise-blended terrain, organic road edges, varied farm crops, 3D-style hipped corrugated roofs, varied compounds (walls, gates, kiosks, tanks, washing lines), tree scale variation, swaying palms and trees.
- Life: keke, okada, cars and danfo buses on road lanes; pedestrians on paths; farmers working plots; seated market vendors and customers. Defined as data in `routes` (see `communityWorld.ts`), run by `game/systems/AmbientLife.ts`. Purely visual; no pathfinding or gameplay.
- Permanent building labels were removed; names show on hover (desktop) and in the info panel (tap).
- Farm plot crops are scenic only; plots are still "available" in the data until Cycle 2.
- Not done yet: Layer 4 (interaction effects, resource-change feedback, UI cohesion), more vehicle types, vendor and customer variety. Untested in a browser: tune counts and speeds on first run.
