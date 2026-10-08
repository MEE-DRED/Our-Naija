# Cycle 10 complete: National visibility and the path to President

Cycle 10 makes the country visible without prematurely implementing a full federal simulation.

## National overview

The Nigeria overview is driven by the centralized dataset in `src/game/data/nigeria.ts`. It displays all 36 States and the Federal Capital Territory, grouped by region. States open into capital, agricultural strengths, opportunities, challenges, and representative LGAs.

LGAs open into representative communities. Communities are browseable, and the player's permanent home community is marked with a star. Other places provide contextual scope messages rather than a generic inaccessible/locked state.

## Political scope

- Community Leader: build and govern the home community.
- Local Government Chairman: govern the home LGA.
- Governor: govern representative LGAs and state systems within the home State.
- President: national scope is prepared but federal gameplay remains future work.

The dashboard now surfaces the home community, home LGA, home State, and leadership journey. Existing saves remain associated with their original profile.

## Presidential foundation

`src/config/president.ts` defines presidential eligibility requirements and national campaign actions. `presidentialEligibility` calculates readiness from the selected State's aggregate metrics and approval. `runPresidentialElection` provides a controlled, non-guaranteed election result; winning changes the role to President, while losing preserves the governorship.

This is intentionally only a foundation. It does not add national taxation, a national food reserve, federal projects, inter-state trade, or all-state simultaneous simulation.

## Performance and limitations

The active community remains fully rendered. The national overview uses lightweight data and representative LGAs, while state metrics remain aggregated. A future cycle can add nearby and distant simulation layers without rendering every community, building, or NPC in Nigeria.
