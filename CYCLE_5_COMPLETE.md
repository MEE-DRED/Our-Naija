# Cycle 5 Complete: Agricultural Value Chains

Cycle 5 extends the community economy from raw harvests into small-scale processing and utilities while preserving the Cycle 1–4 architecture.

## Implemented

- Data-driven recipes for Cassava to Garri, Rice to Milled Rice, Tomatoes to Tomato Paste, and Maize to Maize Meal/Feed.
- A persisted, timestamp-based processing job with input, cash, electricity, time, capacity, and storage validation.
- Processed resources share the existing resource inventory and market flow; processed goods can be sold for Naira.
- Processing, storage, solar, and biogas facilities are represented in the expanded world and use procedural visuals.
- Community Storage capacity is enforced during harvest and processing collection.
- Solar Farm and Farm Waste Biogas Plant upgrades add electricity capacity; processing temporarily increases electricity demand.
- Processing jobs, inventory, treasury, utility values, building levels, transactions, farms, and expansions persist through browser local storage.
- HUD and dashboard utility indicators show electricity capacity/demand and storage usage.
- Processing and utility activity has a dedicated responsive panel and remains connected to the central observable store/action architecture.

## Validation

- `npm run build` passes TypeScript checking and the Vite production build.

## Known limitations

- Only one processing job can run at a time.
- Farm-waste production is represented by the biogas facility foundation and capacity upgrade; detailed waste stock accounting is not yet modeled.
- Product perishability, facility throughput queues, and processed-food reserve conversion are intentionally deferred.
- The Vite bundle reports a large Phaser chunk warning, but the production build succeeds.
