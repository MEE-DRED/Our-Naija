import Phaser from 'phaser';
import { renderWorld, type HitRect } from '../world/renderWorld';
import { AmbientLife } from '../systems/AmbientLife';
import { worldStore, gameStore } from '../../state/stores';
import { selectEntity, markWorldReady, failGame } from '../../state/actions';
import { farmStateAt } from '../../state/actions';
import { economyStore, farmingStore } from '../../state/stores';
import { cropById } from '../data/crops';
import { tickGameTime } from '../systems/time';
import { timeStore } from '../../state/stores';
import { WorldAtmosphere } from '../systems/WorldAtmosphere';
import { audioManager } from '../systems/audio';

const MAX_ZOOM = 2;
const TAP_SLOP = 8;

export class WorldScene extends Phaser.Scene {
  private hits: HitRect[] = [];
  private ring!: Phaser.GameObjects.Graphics;
  private minZoom = 0.5;
  private downPos = { x: 0, y: 0 };
  private last = { x: 0, y: 0 };
  private dragged = false;
  private pinching = false;
  private pinchDist = 0;
  private ambient?: AmbientLife;
  private tip!: Phaser.GameObjects.Text;
  private hoverId: string | null = null;
  private unsubscribe?: () => void;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>;
  private farmOverlays = new Map<string, Phaser.GameObjects.Graphics>();
  private farmUnsubscribe?: () => void;
  private upgradeOverlays = new Map<string, Phaser.GameObjects.Graphics>();
  private navigationUnsubscribe?: () => void;
  private expansionOverlays = new Map<string, Phaser.GameObjects.Graphics>();
  private atmosphere?: WorldAtmosphere;
  private lastAmbientHour = -1;

  constructor() { super('WorldScene'); }

  create() {
    try {
      const world = worldStore.getState().world;
      const worldW = world.cols * world.tileSize, worldH = world.rows * world.tileSize;
      const cam = this.cameras.main;
      cam.setBackgroundColor(0x2f6b3a);
      cam.setBounds(0, 0, worldW, worldH);

      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.hits = renderWorld(this, world, !calm);
      world.expansionPlots.forEach((plot) => {
        this.expansionOverlays.set(plot.id, this.add.graphics().setDepth(21));
      });
      this.syncExpansionVisuals();
      world.farmPlots.forEach((farm) => {
        this.farmOverlays.set(farm.id, this.add.graphics().setDepth(20));
      });
      this.syncFarmVisuals();
      world.buildings.forEach((building) => {
        this.upgradeOverlays.set(building.id, this.add.graphics().setDepth(25));
      });
      this.syncUpgradeVisuals();
      this.ambient = new AmbientLife(this, world, !calm);
      this.atmosphere = new WorldAtmosphere(this, world);
      this.ring = this.add.graphics().setDepth(9000);
      this.tip = this.add.text(0, 0, '', {
        fontFamily: '"Nunito Sans", system-ui, sans-serif', fontSize: '13px', fontStyle: '700', color: '#ffffff',
        backgroundColor: '#0a3d26', padding: { x: 7, y: 3 },
      }).setOrigin(0.5, 1).setDepth(9500).setVisible(false).setResolution(2);
      if (!calm) {
        this.tweens.add({ targets: this.ring, alpha: { from: 1, to: 0.55 }, yoyo: true, repeat: -1, duration: 700 });
      }

      this.updateZoomLimits();
      cam.setZoom(Phaser.Math.Clamp(0.9, this.minZoom, MAX_ZOOM));
      cam.centerOn(20 * world.tileSize, 15 * world.tileSize);

      this.setupInput();
      this.scale.on('resize', this.updateZoomLimits, this);
      this.unsubscribe = gameStore.subscribe(() => this.syncSelection());
      this.farmUnsubscribe = farmingStore.subscribe(() => this.syncFarmVisuals());
      const economyUnsubscribe = economyStore.subscribe(() => this.syncUpgradeVisuals());
      const expansionUnsubscribe = economyStore.subscribe(() => this.syncExpansionVisuals());
      this.navigationUnsubscribe = gameStore.subscribe(() => this.syncNavigation());
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.unsubscribe?.(); this.farmUnsubscribe?.(); this.navigationUnsubscribe?.(); economyUnsubscribe(); expansionUnsubscribe(); this.scale.off('resize', this.updateZoomLimits, this);
      });
      this.syncSelection();
      this.syncNavigation();
      markWorldReady();
    } catch (e) {
      failGame(e instanceof Error ? e.message : 'The game world could not be created.');
    }
  }

  private updateZoomLimits() {
    const world = worldStore.getState().world, cam = this.cameras.main;
    this.minZoom = Math.max(cam.width / (world.cols * world.tileSize), cam.height / (world.rows * world.tileSize));
    cam.setZoom(Phaser.Math.Clamp(cam.zoom, this.minZoom, MAX_ZOOM));
  }

  private setupInput() {
    this.input.addPointer(1);
    const cam = this.cameras.main;
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
    }

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.downPos = { x: p.x, y: p.y }; this.last = { x: p.x, y: p.y }; this.dragged = false;
    });

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const p1 = this.input.pointer1, p2 = this.input.pointer2;
      if (p1.isDown && p2.isDown) {
        this.pinching = true;
        const d = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        if (this.pinchDist > 0) cam.setZoom(Phaser.Math.Clamp(cam.zoom * (d / this.pinchDist), this.minZoom, MAX_ZOOM));
        this.pinchDist = d;
        return;
      }
      if (p.isDown && !this.pinching) {
        if (Phaser.Math.Distance.Between(p.x, p.y, this.downPos.x, this.downPos.y) > TAP_SLOP) this.dragged = true;
        if (this.dragged) {
          cam.scrollX -= (p.x - this.last.x) / cam.zoom;
          cam.scrollY -= (p.y - this.last.y) / cam.zoom;
        }
        this.last = { x: p.x, y: p.y };
      } else if (!p.isDown) {
        const wp = cam.getWorldPoint(p.x, p.y);
        this.hover(this.hitAt(wp.x, wp.y));
      }
    });

    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (this.pinching) {
        if (!this.input.pointer1.isDown && !this.input.pointer2.isDown) { this.pinching = false; this.pinchDist = 0; }
        return;
      }
      if (this.dragged) return;
      const wp = cam.getWorldPoint(p.x, p.y);
      selectEntity(this.hitAt(wp.x, wp.y));
    });

    this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => {
      cam.setZoom(Phaser.Math.Clamp(cam.zoom * (dy > 0 ? 0.9 : 1.1), this.minZoom, MAX_ZOOM));
    });
  }

  private hover(id: string | null) {
    if (id === this.hoverId) return;
    this.hoverId = id;
    this.input.setDefaultCursor(id ? 'pointer' : 'default');
    const h = id ? this.hits.find((r) => r.id === id) : undefined;
    if (!h) { this.tip.setVisible(false); return; }
    this.tip.setText(h.name).setPosition(h.x + h.w / 2, h.y - 6).setVisible(true);
  }

  private hitAt(x: number, y: number): string | null {
    let found: HitRect | null = null;
    for (const h of this.hits) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) found = h;
    return found ? found.id : null;
  }

  private syncSelection() {
    this.ring.clear();
    const id = gameStore.getState().selectedId;
    const h = id ? this.hits.find((r) => r.id === id) : undefined;
    if (!h) return;
    const x = h.x - 4, y = h.y - 4, w = h.w + 8, hh = h.h + 8;
    this.ring.lineStyle(7, 0x000000, 0.55); this.ring.strokeRoundedRect(x, y, w, hh, 8);
    this.ring.lineStyle(3, 0xf2b705, 1); this.ring.strokeRoundedRect(x, y, w, hh, 8);
    this.ring.lineStyle(5, 0xffffff, 1);
    const k = 18;
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + hh, 1, -1], [x + w, y + hh, -1, -1]].forEach(([cx, cy, sx, sy]) => {
      this.ring.beginPath(); this.ring.moveTo(cx + sx * k, cy); this.ring.lineTo(cx, cy); this.ring.lineTo(cx, cy + sy * k); this.ring.strokePath();
    });
  }

  private syncNavigation() {
    const target = gameStore.getState().navigationTarget;
    if (!target) return;
    const world = worldStore.getState().world;
    const building = world.buildings.find((item) => item.id === target);
    const farm = world.farmPlots.find((item) => item.id === target);
    const expansion = world.expansionPlots.find((item) => item.id === target);
    const position = building?.position ?? farm?.position ?? expansion?.position;
    if (position) {
      const camera = this.cameras.main;
      const targetX = Phaser.Math.Clamp((position.x + 1) * world.tileSize - camera.width / (2 * camera.zoom), 0, world.cols * world.tileSize - camera.width / camera.zoom);
      const targetY = Phaser.Math.Clamp((position.y + 1) * world.tileSize - camera.height / (2 * camera.zoom), 0, world.rows * world.tileSize - camera.height / camera.zoom);
      this.tweens.add({ targets: camera, scrollX: targetX, scrollY: targetY, duration: 500, ease: 'Sine.easeInOut' });
    }
    gameStore.setState({ navigationTarget: null });
  }

  private syncFarmVisuals() {
    const world = worldStore.getState().world;
    world.farmPlots.forEach((farm) => {
      const state = farmStateAt(farm.id);
      const graphics = this.farmOverlays.get(farm.id);
      if (!graphics) return;
      graphics.clear();
      if (state.status === 'EMPTY') return;
      const crop = cropById(state.cropId);
      const progress = crop && state.plantedAt ? Math.min(1, (Date.now() - state.plantedAt) / crop.growthMs) : 0;
      const color = state.status === 'READY_TO_HARVEST' ? 0xf2b705 : state.status === 'PLANTED' ? 0x7a5233 : 0x2f8f3f;
      const x = farm.position.x * world.tileSize, y = farm.position.y * world.tileSize;
      const w = farm.footprint.w * world.tileSize, h = farm.footprint.h * world.tileSize;
      graphics.fillStyle(color, 0.9);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < Math.max(3, Math.floor(w / 42)); col++) {
          const px = x + 18 + col * 42, py = y + 22 + row * Math.max(22, (h - 32) / 3);
          if (px < x + w - 12) graphics.fillCircle(px, py - (state.status === 'GROWING' ? progress * 6 : 0), state.status === 'PLANTED' ? 3 : 5 + progress * 3);
        }
      }
      if (state.status === 'READY_TO_HARVEST') {
        graphics.lineStyle(3, 0xffffff, 0.9); graphics.strokeRoundedRect(x + 2, y + 2, w - 4, h - 4, 8);
      }
    });
  }

  private syncUpgradeVisuals() {
    const world = worldStore.getState().world;
    world.buildings.forEach((building) => {
      const graphics = this.upgradeOverlays.get(building.id);
      if (!graphics) return;
      graphics.clear();
      if ((economyStore.getState().buildingLevels[building.id]?.level ?? 1) < 2) return;
      const x = building.position.x * world.tileSize, y = building.position.y * world.tileSize;
      const w = building.footprint.w * world.tileSize, h = building.footprint.h * world.tileSize;
      graphics.lineStyle(4, 0xf2b705, 0.85);
      graphics.strokeRoundedRect(x + 5, y + 5, w - 10, h - 10, 10);
      graphics.fillStyle(0xf2b705, 0.95);
      graphics.fillCircle(x + w - 12, y + 12, 7);
      graphics.lineStyle(2, 0x0a3d26, 1);
      graphics.lineBetween(x + w - 16, y + 12, x + w - 8, y + 12);
      graphics.lineBetween(x + w - 12, y + 8, x + w - 12, y + 16);
    });
  }

  private syncExpansionVisuals() {
    const world = worldStore.getState().world;
    world.expansionPlots.forEach((plot) => {
      const graphics = this.expansionOverlays.get(plot.id);
      if (!graphics) return;
      graphics.clear();
      if (!economyStore.getState().expansions[plot.id]) return;
      const x = plot.position.x * world.tileSize, y = plot.position.y * world.tileSize;
      const w = plot.footprint.w * world.tileSize, h = plot.footprint.h * world.tileSize;
      graphics.lineStyle(4, 0xf2b705, 0.9);
      graphics.strokeRoundedRect(x + 5, y + 5, w - 10, h - 10, 12);
      graphics.fillStyle(0xf2b705, 0.95);
      graphics.fillCircle(x + 16, y + 16, 7);
      graphics.lineStyle(2, 0x0a3d26, 1);
      graphics.lineBetween(x + 12, y + 16, x + 20, y + 16);
      graphics.lineBetween(x + 16, y + 12, x + 16, y + 20);
    });
  }

  update(time: number, delta: number) {
    if (Math.floor(time / 500) !== Math.floor((time - delta) / 500)) this.syncFarmVisuals();
    tickGameTime(delta);
    const gameTime = timeStore.getState();
    const hour = Math.floor(gameTime.minute / 60);
    if (hour !== this.lastAmbientHour) {
      this.lastAmbientHour = hour;
      audioManager.playAmbient(gameTime.weather === 'RAIN' ? 'rain' : 'community');
    }
    if (Math.floor(time / 250) !== Math.floor((time - delta) / 250)) this.atmosphere?.update();
    this.ambient?.update(time, delta);
    if (!this.cursors || !this.wasd) return;
    const cam = this.cameras.main, s = (0.5 * delta) / cam.zoom;
    if (this.cursors.left.isDown || this.wasd.A.isDown) cam.scrollX -= s;
    if (this.cursors.right.isDown || this.wasd.D.isDown) cam.scrollX += s;
    if (this.cursors.up.isDown || this.wasd.W.isDown) cam.scrollY -= s;
    if (this.cursors.down.isDown || this.wasd.S.isDown) cam.scrollY += s;
  }
}
