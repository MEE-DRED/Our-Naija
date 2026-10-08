# Our Naija - Cycle 4

## Implemented

- Expanded the data-driven Odo-Ewa world from 40x30 to 60x45 tiles.
- Added northern and riverside expansion zones, connecting earth roads, and locked expansion plots.
- Added expansion panels with development and Naira requirements plus persistent unlock state.
- Added location shortcuts for Homes, Farms, Market, and Services that pan the Phaser camera.
- Preserved bounded drag, wheel zoom, pinch zoom, and touch selection on the larger world.
- Added centralized community metric calculations for health, education, employment, water, electricity, happiness, housing capacity, jobs, and development.
- Upgrades, food reserve allocations, and land unlocks now refresh the derived community metrics.
- Expanded the dashboard with service metrics, housing capacity, jobs, and employment.
- Added visible locked-land and unlocked-land visual states.
- Existing farming, inventory, market, treasury, upgrades, and local persistence remain active.

## Architecture

- `WorldDefinition` now contains reusable `ExpansionPlot` data.
- `communityMetrics.ts` is the single balancing point for Cycle 4 service relationships.
- `economyStore` owns persisted expansion unlocks and building levels.
- Camera navigation uses the existing `gameStore` bridge rather than a second navigation system.

## Testing

- `npm run build` passes TypeScript validation and the Vite production build.
- Existing pointer/touch camera and selection code remains the interaction path for the larger map.
- Dashboard, market, farming, and expansion UI are implemented as responsive React panels.

## Known limitations

- Population remains a lightweight community value; no demographic simulation is implemented.
- Employment, health, education, water, electricity, happiness, and development use intentionally simple balance formulas.
- New expansion land is unlockable but does not yet support free-form construction.
- World art remains procedural and roads are an initial community network, not a full transport simulation.

## Recommended next cycle

Add predefined build plots on unlocked land, with a small set of residential and utility construction choices that consume Naira and change capacity.
