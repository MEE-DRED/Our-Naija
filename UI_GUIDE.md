# Our Naija UI guide

## Interaction model

Phaser owns world hit-testing through the shared `selectEntity` action. React contextual panels render from the selected entity and call the same state actions for mouse and touch. Do not add separate desktop and mobile gameplay handlers.

## Navigation and panels

The HUD keeps Community, Politics, Nigeria, and Wahala available at all viewport sizes. The Community drawer is bounded and dismissible. Contextual farm, market, service, infrastructure, upgrade, and processing panels appear above the drawer so their controls remain usable.

Long surfaces must use bounded scrolling. The Market keeps its heading and close button visible while product rows scroll independently. Modal content is also bounded; the Community dashboard becomes a bottom sheet on narrow screens.

## Responsive checks

Verify important controls at 1366x768, 1440x900, 390x844, and 360x800. Check mouse click and touch tap for farms and buildings, market scrolling and closing, dashboard dismissal, top navigation, and selection replacement.
