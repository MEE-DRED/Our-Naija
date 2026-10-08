# Crops

Crop definitions live in `src/game/data/crops.ts` and all use the same farm lifecycle: plant, grow, harvest, and store. The current catalog covers staples, legumes, vegetables, and commercial crops. Each definition carries growth time, yield, base market price, food value, future products, and optional regional affinities.

Regional affinities describe Nigerian agricultural variety; they are not difficulty ratings. New crops should be added to the centralized catalog and `ResourceInventory`, not hard-coded into farm components.
