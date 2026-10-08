# Cycle 13 complete: Living community and world simulation

Cycle 13 adds lightweight time and activity systems on top of the existing data-driven world and route-based ambient life.

## Time and activity

The persisted game clock tracks day, month, year, time of day, weather, pause state, and 1x/2x speed. Morning, daytime, evening, and night change the visibility of pedestrians, farm workers, market activity, and traffic. The clock remains separate from the monthly governance turn so inspection does not accidentally advance economic systems.

## World visuals

- Day, evening, and night use restrained colour overlays.
- Buildings receive warm night lighting, dimmed when processing is under pressure.
- Rain uses a bounded lightweight rain-streak effect.
- Harmattan adds atmospheric haze; dry season uses a drier clear presentation.
- Active flooding adds a restrained water indication over the farming area.
- Existing Nigerian visual identity and route-based keke, okada, cars, buses, pedestrians, farms, stalls, boreholes, tanks, and roads are preserved.

## Activity model

Existing `AmbientLife` routes remain the movement representation rather than individual citizen AI. Visible people are an approximation of the population. Existing farm workers and market workers now respond to time of day. Pausing stops route movement and the visible clock; it does not create individual NPC saves.

The model intentionally avoids pathfinding, per-person inventories, relationships, health records, or thousands of active Phaser objects.

## Interaction and performance

World hit-testing remains manual and data-driven through `WorldScene` and `renderWorld`; atmosphere graphics are visual-only and do not intercept clicks. Existing top navigation, contextual side panel, selection highlights, farm/building panels, camera focus, and saves remain in place.

Effects use a small number of Graphics primitives and bounded loops. No large particle textures, post-processing, or per-citizen simulation was added.

## Known limitations

Detailed construction crews, individual NPC inspection, true road pathfinding, exact market cargo routes, and pause-aware real-time crop/processing timers remain future refinements. Monthly gameplay effects continue to use the Cycle 12 simulation pass.
