# Cycle 14 complete: Wahala, citizen voice, and player experience

Cycle 14 extends Wahala from event notifications into a persistent citizen-governance loop.

## Citizen petitions

- Petition templates are data-driven and activate from measurable pressure in electricity, food security, employment, water access, health, education, and food prices.
- Petitions carry a category, priority, affected systems, ward, impact, and submitted turn.
- Duplicate active categories are prevented, active petitions are capped at four, and cooldowns prevent petition spam.
- Petition state persists in `our-naija-citizen-voice`.

## Government response

Each petition progresses through `SUBMITTED`, `RECEIVED`, `UNDER_REVIEW`, `ACTION_PLANNED`, `IN_PROGRESS`, and `RESOLVED`. The Wahala panel exposes the next response action and allows the government to ignore a petition. Resolving a petition improves citizen trust and approval; ignoring it archives the petition and applies a priority-based trust and approval penalty.

Citizen trust is included in the monthly approval calculation and is visible alongside active petitions in the Politics panel. Resolved and ignored petitions remain available in Citizen Voice history.

## Sound and audio

Audio is optional and centralized in `AudioManager` (`src/game/systems/audio.ts`). It provides subtle synthesized music, environment cues driven by time and weather, UI feedback, mute, and independent master, music, environment, and sound-effect volumes. No gameplay system calls browser audio APIs directly.

## Player profile and governance streaks

The Player Profile shows the chosen State, LGA, and community identity; administration and governance statistics; citizen trust; political history using the in-game calendar; achievements; and a daily Governance Streak. Each game day receives one meaningful governance priority. Responding to petitions, reviewing reports, resolving events, harvesting, or completing upgrades can maintain the streak. Streaks are soft: missed days do not erase the best record or impose a harsh reset, and rewards are recognition, achievements, and light feedback rather than political power.

## Integration and limitations

Petitions are advanced and generated during the existing monthly simulation pass, preserving the event engine, service metrics, elections, navigation, and persistence systems. Current responses model governance lifecycle, trust, and approval rather than creating separate construction projects or charging funds for each category. Future cycles can connect response stages to existing infrastructure upgrades without duplicating systems.

## Verification

- `npm run typecheck` passes.
- `npm run build` passes after the Cycle 14 changes.
- Existing Phaser hit-testing, contextual side-panel selection, monthly simulation, time controls, and localStorage persistence remain unchanged.
