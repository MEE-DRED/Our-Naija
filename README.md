# Our Naija

A browser-based Nigerian strategy and city-building game where agriculture powers community development and leadership.

> Build your land. Feed your people. Lead your nation.

**Status:** Cycle 15B (responsive UI stabilization plus expanded crops and functional processing). See `CYCLE_15B_COMPLETE.md`.

## Requirements
- Node.js 18.18 or newer
- npm 9 or newer

## Install
```bash
npm install
```

## Develop
```bash
npm run dev
```
Open the printed local URL (usually http://localhost:5173).

## Type-check
```bash
npm run typecheck
```

## Production build
```bash
npm run build
```
Output goes to `dist/`. The project deploys to Vercel as a standard Vite app (framework preset: Vite, output: `dist`).

## Preview the production build
```bash
npm run preview
```

## Controls
- Drag (mouse or touch) to pan. Mouse wheel or pinch to zoom. Arrow keys or WASD also pan.
- Click or tap a building or farm plot to see its details. Esc closes panels.
- Select a farm plot, choose a crop, then return after its growth timer completes to harvest it. Farm and resource state is saved in browser local storage.
- Select the Community Market to sell crops for Naira or add staple crops to the Food Reserve. Select eligible community buildings to purchase Level 2 upgrades.
- Use the location shortcuts in the HUD to navigate the expanded community. Locked expansion plots can be opened when Development and Treasury requirements are met.
- Select a processing facility to turn raw crops into Garri, Milled Rice, Tomato Paste, or Maize Meal/Feed. Processing consumes inputs, treasury funds, electricity headroom, time, and storage.
- Community Storage, Solar Farm, and Farm Waste Biogas Plant can be upgraded for additional storage or electricity capacity. Processing jobs and economy state persist in browser local storage.
- Open Politics from the HUD to track public approval, meet election requirements, campaign with Naira, respond to a market event, and contest the Local Government Chairman election. A loss is recoverable; a win persists as your new leadership position.
- As Local Government Chairman, open LGA to manage four distinct wards, review LGA-wide food and service metrics, retain surplus food, collect activity-based revenue, and fund time-based roads, clinics, schools, and solar mini-grid projects.
- On first play, select a permanent State, LGA, and starting community. Open Wahala to review active events and governance history, then use Advance month to encounter controlled, condition-based challenges and opportunities.
- Citizen petitions arise from service pressure. Respond through the petition lifecycle to build trust, or ignore petitions and accept approval consequences.
- Open Profile to review your administration, political history, achievements, citizen trust, daily governance priority, and soft Governance Streak. Audio can be muted or balanced by layer from Settings.
- Farm, market, service, infrastructure, and processing panels use the same shared actions for mouse and touch. Market and dashboard surfaces are bounded and dismissible on desktop and mobile.
- Agriculture now supports 17 centralized crops and multi-option cassava, rice, tomato, and maize processing through the existing inventory, electricity, market, and time systems.
- When Chairman requirements are met, open Governor to review eligibility, contest the fictional State Governor election, and manage state-wide projects for the original State.
- Open Nigeria from the HUD to browse all 36 States, FCT, representative LGAs, and communities. Other places are viewable but remain outside your current political authority.
- Use the compact menu button to open the responsive Home, Farms, Market, Services, Politics, and Events side panel. Farms, Market, Clinic, and School actions focus the world camera on the relevant entity.
- Advancing a month recalculates bounded food, employment, electricity, services, happiness, population, approval, market pressure, and a performance report for the active community.
- The world now has a persisted day/time clock, pause and 1x/2x controls, responsive ambient people and vehicles, day/night lighting, and lightweight weather visuals.

## Environment variables
None are required for Cycle 1. `.env.example` lists the optional Supabase variables reserved for later cycles.

## Project layout
```
src/
  app/          React app shell
  components/   Title, loading, HUD, economy, processing, info panels and modals
  config/       App text and leadership level config
  game/
    scenes/     Phaser scenes (WorldScene)
    world/      Terrain, procedural drawing, world renderer
    data/       Data-driven community world and entity info
  state/        Observable stores and centralized gameplay actions
  services/     Supabase client (not used yet)
  types/        Shared TypeScript types
  assets/       Reserved asset folders (Cycle 1 art is drawn in code)
```
