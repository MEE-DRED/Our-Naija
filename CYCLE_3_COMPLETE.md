# Our Naija - Cycle 3

## Implemented systems

- Crop inventory now supports market prices, quantities, icons, and data-driven crop metadata.
- Community Market is selectable and allows selling all available crops for Naira.
- Staple crops can be moved from inventory into a persistent Community Food Reserve.
- Food Reserve increases the existing Food Security metric without introducing a population simulation.
- Treasury is now functional: sales add Naira and upgrades deduct it.
- Upgradeable community improvements cover the first farm, market, borehole, school, and clinic levels.
- Level 2 upgrades add a visible gold upgrade marker in the world and increase Development.
- Short transaction notifications and a rolling recent transaction history provide economic feedback.
- Treasury, inventory, reserve, development, building levels, and transactions persist in browser local storage.

## Architecture

- `src/game/data/economy.ts` centralizes sale prices, upgrade costs/effects, and reserve-eligible crops.
- `src/types/economy.ts` defines building levels and transaction records.
- `economyStore` owns building levels, recent transactions, and transient notifications.
- Existing `playerStore` remains the source of treasury, inventory, food reserve, Food Security, and Development.
- Economy actions remain centralized in `src/state/actions.ts`, keeping UI components declarative.

## Files changed

- Added `src/types/economy.ts`, `src/game/data/economy.ts`
- Added `src/components/MarketPanel.tsx`, `src/components/UpgradePanel.tsx`
- Updated stores/actions/player state, App routing, HUD, FarmPanel, Phaser world overlays, and styles
- Updated `CLAUDE.md` and `README.md` status/documentation

## Testing and build

- `npm run build` passes TypeScript validation and Vite production bundling.
- The existing game launch and selection flow remains intact.
- Market and upgrade panels use the same pointer/touch selection path as Cycle 1 and Cycle 2.

## Known limitations

- Market prices and upgrade values are balance values, not real-world Nigerian price claims.
- Selling does not yet model population consumption; Food Reserve is an explicit player allocation.
- Only one upgrade level is currently available per structure.
- Persistence is browser-local; cloud saves, processing, taxation, and advanced economy systems are deferred.

## Recommended next cycle

Add simple crop processing and employment: let selected raw crops become a small number of food products, then connect production capacity to jobs and market demand.
