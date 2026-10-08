import Phaser from 'phaser';
import type { WorldDefinition } from '../../types/world';
import { mulberry32 } from '../../utils/rng';
import { BRIGHTS, drawHoe, drawPerson, drawVehicle, randomStyle, type VehicleKind } from '../world/drawActors';
import { marketStalls } from '../world/draw';
import { activityForHour } from './time';
import { timeStore } from '../../state/stores';

interface Pt { x: number; y: number }
interface Mover {
  g: Phaser.GameObjects.Graphics; pts: Pt[]; seg: number; x: number; y: number;
  speed: number; pingPong: boolean; dir: 1 | -1; walker: boolean; phase: number;
}

const CAR_COLORS = [0xffffff, 0xc0392b, 0x2f6fb0, 0x7f8c8d, 0x1d2b24];
const KINDS: VehicleKind[] = ['KEKE', 'OKADA', 'CAR', 'BUS', 'KEKE', 'OKADA'];
const length = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0);

/** Decorative people and traffic. Purely visual: no gameplay, no pathfinding. */
export class AmbientLife {
  private movers: Mover[] = [];
  private farmWorkers: Phaser.GameObjects.Graphics[] = [];
  private marketWorkers: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene, world: WorldDefinition, private animate: boolean) {
    const T = world.tileSize, rnd = mulberry32(4242);
    const pick = <A>(a: readonly A[]): A => a[Math.floor(rnd() * a.length)];

    for (const route of world.routes) {
      const pts = route.points.map((p) => ({ x: p.x * T, y: p.y * T }));
      const total = length(pts), vehicle = route.kind === 'VEHICLE';
      for (let i = 0; i < route.count; i++) {
        const g = scene.add.graphics();
        if (vehicle) {
          const kind = pick(KINDS);
          const color = kind === 'KEKE' ? 0xf2c230 : kind === 'BUS' ? 0xf2b705 : kind === 'OKADA' ? pick(BRIGHTS) : pick(CAR_COLORS);
          drawVehicle(g, kind, route.facing ?? 'E', color);
        } else drawPerson(g, randomStyle(rnd));
        const m: Mover = {
          g, pts, seg: 0, x: pts[0].x, y: pts[0].y, dir: 1, walker: !vehicle, phase: rnd() * 6,
          pingPong: route.pingPong ?? false, speed: vehicle ? route.speed : route.speed * (0.85 + rnd() * 0.3),
        };
        this.step(m, vehicle ? ((i + rnd() * 0.4) / route.count) * total : rnd() * total);
        this.place(m, 0);
        this.movers.push(m);
      }
    }

    const sway = (g: Phaser.GameObjects.Graphics, from: number, to: number) => {
      if (!animate) return;
      scene.tweens.add({ targets: g, angle: { from, to }, duration: 650 + rnd() * 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: rnd() * 600 });
    };

    world.farmPlots.forEach((f, i) => {
      for (let k = 0; k < 1 + (i % 2); k++) {
        const g = scene.add.graphics();
        drawPerson(g, randomStyle(rnd)); drawHoe(g);
        g.setPosition(f.position.x * T + 30 + rnd() * (f.footprint.w * T - 70), f.position.y * T + 34 + rnd() * (f.footprint.h * T - 56));
        g.setDepth(g.y); sway(g, 6, 24);
        this.farmWorkers.push(g);
      }
    });

    const market = world.buildings.find((b) => b.id === 'market');
    if (market) {
      for (const s of marketStalls()) {
        const g = scene.add.graphics();
        drawPerson(g, randomStyle(rnd, true));
        g.setPosition(market.position.x * T + s.x + s.w / 2, market.position.y * T + s.y + 60);
        g.setDepth(g.y);
        this.marketWorkers.push(g);
      }
    }
  }

  private step(m: Mover, dist: number) {
    let remaining = dist, guard = 0;
    while (remaining > 0 && guard++ < 400) {
      const target = m.pts[m.seg + m.dir];
      if (!target) {
        if (m.pingPong) { m.dir = m.dir === 1 ? -1 : 1; if (!m.pts[m.seg + m.dir]) break; continue; }
        m.seg = 0; m.x = m.pts[0].x; m.y = m.pts[0].y; continue;
      }
      const d = Math.hypot(target.x - m.x, target.y - m.y);
      if (d <= remaining) { m.x = target.x; m.y = target.y; m.seg += m.dir; remaining -= d; }
      else { m.x += ((target.x - m.x) / d) * remaining; m.y += ((target.y - m.y) / d) * remaining; remaining = 0; }
    }
  }

  private place(m: Mover, time: number) {
    const bob = m.walker && this.animate ? Math.sin(time * 0.012 + m.phase) * 1.2 : 0;
    m.g.setPosition(m.x, m.y + bob).setDepth(m.y);
  }

  update(time: number, delta: number) {
    if (!this.animate) return;
    const activity = activityForHour(timeStore.getState().minute);
    const visibility = activity === 'night' ? 0.2 : activity === 'evening' ? 0.7 : 1;
    for (const m of this.movers) {
      if (!timeStore.getState().paused) this.step(m, (m.speed * delta) / 1000);
      m.g.setAlpha(m.walker && activity === 'night' ? 0.18 : visibility);
      this.place(m, time);
    }
    this.farmWorkers.forEach((g) => g.setAlpha(activity === 'day' || activity === 'morning' ? 1 : 0.15));
    this.marketWorkers.forEach((g) => g.setAlpha(activity === 'day' ? 1 : activity === 'morning' || activity === 'evening' ? 0.7 : 0.2));
  }
}
