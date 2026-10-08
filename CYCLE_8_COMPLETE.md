# Cycle 8 complete: Events, Wahala & dynamic consequences

Cycle 8 adds a reusable, data-driven event layer without introducing governor or presidential gameplay.

## Event architecture

- Event definitions live in `src/game/data/events.ts`.
- `src/game/systems/events.ts` owns controlled trigger selection, season rotation, cooldowns, resolution, and persistence.
- `eventStore` persists the current month, season, active event, cooldowns, and the last 20 governance-history entries in `our-naija-events`.
- Events are advanced by the player's **Advance month** action; there is no timer-driven popup spam.

The event set includes fuel scarcity, flooding, dry-season water stress, crop disease, power outage, food contamination, transport disruption, contractor issues, community protest, agricultural opportunity, and trade opportunity.

## Consequences and recovery

Choices update existing treasury, food security, happiness, electricity, employment, development, and political approval values. Active events can expire, while resolved and expired events remain in governance history. Severity, affected area, duration, trigger conditions, and cooldowns are data-driven.

The lightweight weather foundation rotates through rainy season, dry season, and harmattan. Conditions influence which events can appear.

## Community-selection architecture

First-time play requires selecting a State, LGA, and starting community. The selection is stored in `our-naija-profile` and copied into the player profile. Existing accounts can continue their original origin but cannot replace it from the setup screen. The profile remains available at every leadership level; Cycle 8 does not implement governor, state-wide, or national controls.

## Known limitations and future work

- Consequences are intentionally lightweight and use existing community metrics rather than a separate event score.
- The weather system is a seasonal foundation, not a detailed simulation.
- Food safety events establish the decision and trust foundation; laboratory and traceability simulation remain future work.
- Opportunities currently use deterministic placeholder revenue and do not implement inter-LGA trade.
- Governor, presidential, national, multiplayer, corruption, and advanced inflation systems remain out of scope.
