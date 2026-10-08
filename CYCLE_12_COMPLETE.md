# Cycle 12 complete: Advanced simulation and system integration

Cycle 12 connects the existing agriculture, economy, services, events, and politics foundations without replacing their individual interaction panels.

## Monthly simulation

Advancing a month now runs one bounded active-community simulation pass:

- Food security combines food reserve, raw and processed food, population demand, farm capacity, and active disruption pressure, clamped to 0-100.
- Employment is derived from farms, market, clinic, school, government, and active processing work.
- Electricity capacity versus demand affects the electricity metric and feeds into healthcare and education.
- Happiness combines food, health, education, employment, electricity, housing, and event pressure.
- Population changes slowly and only when living conditions and housing support it.
- Approval is recalculated from the resulting governance metrics.

The simulation does not run every Nigerian community. Other States, LGAs, and communities remain browseable/aggregated as established in Cycle 10.

## Market and processing

Raw-crop prices now use a bounded, persisted market index. Stock scarcity increases prices gradually; available stock reduces them. Fuel and transport disruptions add controlled pressure. Processed products retain their higher configured value, so processing remains a meaningful alternative to selling raw crops.

Existing processing requirements remain in force: input stock, treasury, electricity headroom, processing time, and storage capacity.

## Reports and persistence

Each monthly pass records a concise performance report with metric deltas, the strongest area, and the main concern. The report and market indices are persisted alongside existing player, farming, economy, event, and political saves.

## Events and weather

The Cycle 8 event engine remains data-driven with seasons, cooldowns, severity, active duration, choices, and history. Active flooding, drought, crop disease, contamination, power, fuel, and transport events now apply bounded pressure during monthly simulation while their existing decisions continue to apply immediate consequences.

## Known limitations

Detailed spoilage, per-building operating budgets, multi-queue processing, full road-network logistics, and aggregate distant-State simulation remain future work. The current pass intentionally favors explainable bounded effects over a hidden high-frequency simulation.
