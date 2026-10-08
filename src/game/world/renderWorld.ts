import Phaser from 'phaser';
import type { WorldDefinition } from '../../types/world';
import { buildTerrainGrid } from './terrain';
import { C } from './palette';
import { mulberry32 } from '../../utils/rng';
import { mix } from '../../utils/color';
import { fbm } from '../../utils/noise';
import * as D from './draw';
import { economyStore } from '../../state/stores';

export interface HitRect { id: string; name: string; x: number; y: number; w: number; h: number }

function renderTerrain(scene: Phaser.Scene, world: WorldDefinition) {
  const T = world.tileSize, S = T / 2, grid = buildTerrainGrid(world), rnd = mulberry32(7);
  const g = scene.add.graphics().setDepth(0);

  for (let sy = 0; sy < world.rows * 2; sy++) for (let sx = 0; sx < world.cols * 2; sx++) {
    const t = grid[sy >> 1][sx >> 1], px = sx * S, py = sy * S;
    const n = fbm(px / 260, py / 260, 3), n2 = fbm(px / 90, py / 90, 9);
    let color: number;
    if (t === 'ROAD_TARRED') color = mix(0x40414a, 0x4c4d56, n2);
    else if (t === 'ROAD_EARTH') color = mix(0xc2834f, 0xd6a06a, n2);
    else if (t === 'RED_EARTH' || t === 'FARMLAND') color = mix(0xa85d34, 0xc7794a, n);
    else { color = mix(0x3f8a40, 0x6cb04e, n); if (n2 > 0.7) color = mix(color, 0xa6b84e, 0.5); }
    g.fillStyle(color, 1); g.fillRect(px, py, S + 1, S + 1);
  }

  const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let ty = 0; ty < world.rows; ty++) for (let tx = 0; tx < world.cols; tx++) {
    const t = grid[ty][tx];
    if (t !== 'ROAD_EARTH' && t !== 'RED_EARTH') continue;
    const col = t === 'ROAD_EARTH' ? 0xcb8f5a : 0xb86a3e;
    for (const [dx, dy] of dirs) {
      if (grid[ty + dy]?.[tx + dx] !== 'GRASS') continue;
      for (let k = 0; k < 5; k++) {
        const along = rnd() * T, depth = rnd() * 9;
        const px = dx === 1 ? (tx + 1) * T + depth : dx === -1 ? tx * T - depth : tx * T + along;
        const py = dy === 1 ? (ty + 1) * T + depth : dy === -1 ? ty * T - depth : ty * T + along;
        g.fillStyle(col, 0.85); g.fillEllipse(px, py, 6 + rnd() * 10, 4 + rnd() * 7);
      }
    }
  }

  const FLOWERS = [0xffffff, 0xf2b705, 0xe8743b];
  for (let ty = 0; ty < world.rows; ty++) for (let tx = 0; tx < world.cols; tx++) {
    const t = grid[ty][tx];
    for (let k = 0; k < 3; k++) {
      const r = rnd(), px = tx * T + rnd() * T, py = ty * T + rnd() * T;
      if (t === 'GRASS' || t === 'WATER') {
        if (r < 0.3) {
          g.lineStyle(2, C.grassDark, 0.6); g.beginPath(); g.moveTo(px, py); g.lineTo(px - 2, py - 7); g.moveTo(px + 4, py); g.lineTo(px + 5, py - 6); g.strokePath();
        } else if (r < 0.34) { g.fillStyle(FLOWERS[Math.floor(rnd() * 3)], 1); g.fillCircle(px, py, 1.8); }
      } else if (t === 'ROAD_EARTH' || t === 'RED_EARTH') {
        if (r < 0.4) { g.fillStyle(0x000000, 0.1); g.fillEllipse(px, py, 7, 3); }
        else if (r > 0.92) { g.fillStyle(0xe6c9a3, 1); g.fillCircle(px, py, 1.6); }
      } else if (t === 'ROAD_TARRED' && r < 0.12) {
        g.fillStyle(0x000000, 0.14); g.fillRect(px, py, 10 + rnd() * 14, 5 + rnd() * 6);
      }
    }
  }

  world.roads.filter((r) => r.surface === 'TARRED').forEach((r) => {
    const x0 = r.position.x * T, x1 = (r.position.x + r.footprint.w) * T, y0 = r.position.y * T, y1 = (r.position.y + r.footprint.h) * T;
    g.lineStyle(2, 0xffffff, 0.5); g.beginPath(); g.moveTo(x0, y0 + 4); g.lineTo(x1, y0 + 4); g.moveTo(x0, y1 - 4); g.lineTo(x1, y1 - 4); g.strokePath();
    g.fillStyle(C.gold, 1);
    for (let x = x0; x < x1; x += 44) if (x < 19 * T - 10 || x > 21 * T) g.fillRect(x, (y0 + y1) / 2 - 2, 24, 4);
    g.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < 8; i++) g.fillRect(23 * T + 4, y0 + 6 + i * 11, T - 8, 6);
    [[0, 19 * T], [21 * T, x1]].forEach(([a, b]) => {
      [y0 - 8, y1].forEach((yy) => { g.fillStyle(C.concrete, 1); g.fillRect(a, yy, b - a, 8); g.fillStyle(0x4b5258, 1); g.fillRect(a, yy + 2, b - a, 4); });
    });
  });

  world.resources.forEach((p) => {
    const cx = (p.position.x + p.footprint.w / 2) * T, cy = (p.position.y + p.footprint.h / 2) * T;
    const rw = (p.footprint.w * T) / 2, rh = (p.footprint.h * T) / 2;
    g.fillStyle(0xd9c08a, 1); g.fillEllipse(cx, cy, rw * 2 + 14, rh * 2 + 14);
    g.fillStyle(C.waterDark, 1); g.fillEllipse(cx, cy, rw * 2, rh * 2);
    g.fillStyle(C.water, 1); g.fillEllipse(cx - 6, cy - 4, rw * 1.7, rh * 1.6);
    g.fillStyle(0x3f8a40, 1); [[-50, 20], [30, -30], [60, 25], [-10, 40]].forEach(([dx, dy]) => g.fillEllipse(cx + dx, cy + dy, 14, 7));
    g.lineStyle(2, 0xffffff, 0.45); g.strokeEllipse(cx - 30, cy - 10, 50, 14); g.strokeEllipse(cx + 40, cy + 16, 40, 10);
  });
}

function renderWires(scene: Phaser.Scene, world: WorldDefinition) {
  const poles = world.decorations.filter((d) => d.kind === 'POWER_POLE').sort((a, b) => a.x - b.x);
  const g = scene.add.graphics().setDepth(5000);
  g.lineStyle(1.5, 0x1d2b24, 0.85);
  for (let i = 0; i < poles.length - 1; i++) {
    [-10, 10].forEach((dx) => {
      const x1 = poles[i].x + dx, x2 = poles[i + 1].x + dx, y = poles[i].y - 50;
      g.beginPath(); g.moveTo(x1, y);
      for (let s = 1; s <= 6; s++) { const t = s / 6; g.lineTo(x1 + (x2 - x1) * t, y + Math.sin(t * Math.PI) * 6); }
      g.strokePath();
    });
  }
}

export function renderWorld(scene: Phaser.Scene, world: WorldDefinition, animate: boolean): HitRect[] {
  const T = world.tileSize, hits: HitRect[] = [], rnd = mulberry32(55);
  renderTerrain(scene, world);

  world.farmPlots.forEach((f, i) => {
    const x = f.position.x * T, y = f.position.y * T, w = f.footprint.w * T, h = f.footprint.h * T;
    D.drawFarmPlot(scene.add.graphics({ x, y }).setDepth(1), w, h, f.soil, i);
    hits.push({ id: f.id, name: f.name, x, y, w, h });
  });

  world.expansionPlots.forEach((plot) => {
    const x = plot.position.x * T, y = plot.position.y * T, w = plot.footprint.w * T, h = plot.footprint.h * T;
    const unlocked = economyStore.getState().expansions[plot.id];
    const g = scene.add.graphics({ x, y }).setDepth(1);
    g.fillStyle(unlocked ? 0x9a633d : 0x5b6f4a, 0.9);
    g.fillRoundedRect(0, 0, w, h, 12);
    g.lineStyle(4, unlocked ? 0xf2b705 : 0xe6c9a3, 0.8);
    g.strokeRoundedRect(2, 2, w - 4, h - 4, 12);
    if (!unlocked) {
      g.fillStyle(0x102a1f, 0.5); g.fillRect(0, h / 2 - 18, w, 36);
      g.fillStyle(0xffffff, 0.95); g.fillCircle(w / 2 - 42, h / 2, 8);
      g.lineStyle(3, 0xffffff, 0.95); g.strokeRect(w / 2 - 50, h / 2, 16, 14);
      g.fillStyle(0xffffff, 0.95); g.fillRect(w / 2 - 45, h / 2 - 8, 6, 10);
    }
    hits.push({ id: plot.id, name: plot.name, x, y, w, h });
  });

  world.buildings.forEach((b) => {
    const x = b.position.x * T, y = b.position.y * T, w = b.footprint.w * T, h = b.footprint.h * T;
    const g = scene.add.graphics({ x, y }).setDepth(b.kind === 'MARKET' ? y + 4 : y + h - 40);
    const v = b.variant ?? 0;
    switch (b.kind) {
      case 'HOUSE': D.drawHouse(g, w, h, v); break;
      case 'SCHOOL': D.drawSchool(g, w, h); break;
      case 'CLINIC': D.drawClinic(g, w, h); break;
      case 'MARKET': D.drawMarket(g, w, h); break;
      case 'BOREHOLE': D.drawBorehole(g, w, h); break;
      case 'POWER': D.drawPower(g, w, h); break;
      case 'LG_OFFICE': D.drawLGOffice(g, w, h); break;
      case 'PROCESSING':
      case 'STORAGE':
      case 'SOLAR':
      case 'BIOGAS': D.drawProcessingBuilding(g, w, h, b.kind); break;
    }
    hits.push({ id: b.id, name: b.name, x, y, w, h });
  });

  world.decorations.forEach((d) => {
    const g = scene.add.graphics({ x: d.x, y: d.y }).setDepth(d.y).setScale(d.scale);
    switch (d.kind) {
      case 'PALM': D.drawPalm(g, 0, 0, d.variant); break;
      case 'TREE': D.drawTree(g, 0, 0, d.variant); break;
      case 'SHRUB': D.drawShrub(g, 0, 0, d.variant); break;
      case 'BANANA': D.drawBanana(g, 0, 0); break;
      case 'STALL': D.drawStall(g, 0, 0, d.variant); break;
      case 'KIOSK': D.drawKiosk(g, 0, 0, d.variant); break;
      case 'POWER_POLE': D.drawPole(g, 0, 0); break;
    }
    if (animate && (d.kind === 'PALM' || d.kind === 'TREE' || d.kind === 'BANANA')) {
      const amp = d.kind === 'TREE' ? 0.7 : 1.5;
      scene.tweens.add({ targets: g, angle: { from: -amp, to: amp }, duration: 2200 + rnd() * 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: rnd() * 2000 });
    }
  });
  renderWires(scene, world);
  return hits;
}
