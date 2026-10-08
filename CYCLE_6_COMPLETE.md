# Cycle 6 Complete: Politics, Leadership & Local Elections

Cycle 6 adds the first political progression layer without replacing the farming, economy, services, processing, or navigation systems from Cycles 1–5.

## Implemented

- Public approval is calculated from Food Security, Health, Education, Electricity, Employment, Happiness, Development, and Treasury performance using centralized weights.
- Election eligibility is data-driven: Development 70, Food Security 65, Healthcare 55, Education 50, Electricity 50, Employment 55, and Happiness 60.
- The Politics panel shows approval factors, unmet requirements, campaign progress, election history, and the current leadership phase.
- Campaign actions spend the existing Naira treasury and have bounded uses: community meetings, food, health, education, youth employment, infrastructure, and market outreach.
- A Market Traders Meeting event offers promise, fund repairs, or explain-limited-funds choices with different costs and approval consequences.
- Fictional candidates and lightweight voter groups are data-driven. Farmers, traders, youth, families, workers, and health/community workers respond to different service priorities.
- Election results use approval, campaign effects, voter priorities, candidate strengths, economic context, and a small deterministic noise factor. The player can win or lose.
- Losing records the result and keeps the community playable for a later attempt. Winning changes the persistent role to Local Government Chairman.
- HUD and dashboard leadership displays remain compatible with the existing population, food, treasury, power, employment, happiness, and development indicators.
- Election history, approval, campaign spending/uses, phase, result, and role survive browser reload.

## Validation

- `npm run build` passes TypeScript checking and the Vite production build.
- The existing local server remains available at `http://127.0.0.1:5173/`.

## Known limitations

- The campaign is a single bounded preparation phase; there is no calendar or multi-week campaign simulation yet.
- Ward 1–4 and broader Local Government management remain a foundation for a later cycle rather than a complete multi-community map.
- Governor, state, national, party, corruption, multiplayer, and real-world political systems are intentionally not implemented.
