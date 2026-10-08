import Phaser from 'phaser';
import type { WorldDefinition } from '../../types/world';
import { eventStore, playerStore, timeStore } from '../../state/stores';

export class WorldAtmosphere {
  private overlay: Phaser.GameObjects.Graphics;
  private world: WorldDefinition;

  constructor(scene: Phaser.Scene, world: WorldDefinition) {
    this.world = world;
    this.overlay = scene.add.graphics().setDepth(8000);
    this.update();
  }

  update() {
    const time = timeStore.getState();
    const hour = time.minute / 60;
    const night = hour < 6 || hour >= 21;
    const evening = hour >= 17 && hour < 21;
    const powerShortage = playerStore.getState().electricityCapacity < playerStore.getState().electricityDemand;
    const event = eventStore.getState().active?.eventId;
    const g = this.overlay;
    g.clear();
    if (night) g.fillStyle(0x102a4f, 0.3);
    else if (evening) g.fillStyle(0xc56a3b, 0.1);
    else if (time.weather === 'HAZE') g.fillStyle(0xd8c9a2, 0.12);
    else if (time.weather === 'RAIN') g.fillStyle(0x315b72, 0.08);
    else g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, this.world.cols * this.world.tileSize, this.world.rows * this.world.tileSize);

    if (night) {
      this.world.buildings.forEach((building) => {
        const x = building.position.x * this.world.tileSize + building.footprint.w * this.world.tileSize / 2;
        const y = building.position.y * this.world.tileSize + 20;
        g.fillStyle(powerShortage ? 0x8b6d2d : 0xf2b705, powerShortage ? 0.25 : 0.75);
        g.fillCircle(x, y, 9);
      });
    }
    if (time.weather === 'RAIN') {
      g.lineStyle(2, 0xb8dcf2, 0.35);
      for (let i = 0; i < 90; i++) {
        const x = (i * 137) % (this.world.cols * this.world.tileSize);
        const y = (i * 83) % (this.world.rows * this.world.tileSize);
        g.lineBetween(x, y, x - 5, y + 14);
      }
    }
    if (event === 'flooding') {
      g.fillStyle(0x3a9ad9, 0.16);
      g.fillRect(22 * this.world.tileSize, 7 * this.world.tileSize, 17 * this.world.tileSize, 3 * this.world.tileSize);
    }
  }
}
