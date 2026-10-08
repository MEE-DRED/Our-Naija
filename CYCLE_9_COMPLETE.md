# Cycle 9 complete: 36 states and Governor governance

Cycle 9 establishes Nigeria as the long-term game world while keeping the browser simulation layered and manageable.

## National data architecture

`src/game/data/nigeria.ts` is the single source of truth for all 36 Nigerian States and the Federal Capital Territory. Each administrative region includes its region, capital, agricultural and secondary strengths, opportunities, environmental challenges, and representative LGAs. FCT is represented as an administrative region separate from the State list.

The hierarchy is:

`Nigeria -> State or FCT -> LGA -> Community`

The first-run setup uses this dataset rather than a UI-local list. The selected State, LGA, and community remain persistent in the player profile. Existing saves continue with their migrated Ogun/Odo-Ewa profile unless the player has already established a profile.

## Geographical progression

- Community Leader: original community
- Local Government Chairman: original LGA
- Governor: all representative LGAs in the original State
- President: reserved for a future cycle and will be national in scope

The original community is displayed as the player's political origin and is not replaced when the role changes.

## Governor pathway

`src/config/governor.ts` contains Governor eligibility requirements and state project definitions. A Chairman must demonstrate strong LGA development, food security, services, employment, happiness, and approval before beginning the fictional Governor election foundation.

The Governor dashboard provides:

- State development, food security, treasury, reserve, production, and demand
- State-wide project funding
- Agricultural processing, roads, healthcare, education, electricity, and extension projects
- A foundation for state-level LGA aggregation without rendering every state building

State metrics and completed projects persist through `stateStore` and `our-naija-state`.

## Performance strategy

The current implementation uses representative LGAs and aggregate state metrics. The active community remains fully rendered; LGA and state scopes use lightweight summaries. A future national layer can add nearby and distant simulation without rendering every building or NPC simultaneously.

## Deliberate exclusions

Presidential elections, federal government, national taxation, national food reserves, national power systems, inter-state trade, real politicians, real parties, multiplayer, and monetisation remain out of scope.
