# Cycle 15B complete: agriculture, crops, and functional processing

Cycle 15B extends the existing land, inventory, market, electricity, and processing systems into a broader playable agriculture loop:

`Plant -> Grow -> Harvest -> Process -> Sell -> Earn -> Develop`

## Crops

The centralized crop catalog now includes:

- Staples: cassava, rice, maize, yam, millet, and sorghum
- Legumes: cowpea, groundnut, and soybean
- Vegetables: tomatoes, pepper, okra, onion, and leafy vegetables
- Commercial crops: cocoa, oil palm, and cashew

All crops use the existing reusable farm lifecycle and are persisted in the same resource inventory. Crop metadata includes category, growth duration, yield, base price, food value, future products, and regional affinities. Regional affinities communicate agricultural identity without ranking states.

## Processing

Existing facilities now expose reusable recipe options:

- Garri mill: garri, fufu, cassava flour, and starch
- Rice mill: milled rice and packaged rice
- Tomato facility: tomato paste and tomato sauce
- Maize facility: maize flour, maize meal, and livestock feed

Starting a recipe validates input, treasury, electricity headroom, and the single active processing capacity. Raw input is consumed when the job starts, the job advances using the existing pause-aware simulation clock, and the output is added when collected. The panel shows status, available input, requirements, output, time, progress, and a reason when processing cannot start.

## Market and simulation integration

New raw crops and processed goods use the existing market and sale action. Raw crops use the persisted dynamic price index; processed goods use the existing product-price table. Food security counts current raw reserves and processed stocks without counting consumed raw input twice. Processing electricity demand and jobs use the existing player metrics.

## Validation and limitations

- `npm run typecheck` passes.
- `npm run build` passes after the Cycle 15B changes.
- Existing farm, market, storage, electricity, time, persistence, and mouse/touch action paths are preserved.
- Processing currently allows one active job at a time, matching the existing queue model. Tomato spoilage and regional yield modifiers remain future balancing work because no completed spoilage architecture existed to extend safely in this cycle.
