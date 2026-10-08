import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { WorldScene } from '../game/scenes/WorldScene';
import { failGame } from '../state/actions';

export function GameCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let game: Phaser.Game | undefined;
    try {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: el,
        backgroundColor: '#2f6b3a',
        scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
        input: { activePointers: 2 },
        scene: [WorldScene],
      });
    } catch (e) {
      failGame(e instanceof Error ? e.message : 'The game could not start in this browser.');
    }
    const block = (e: Event) => e.preventDefault();
    el.addEventListener('contextmenu', block);
    return () => { el.removeEventListener('contextmenu', block); game?.destroy(true); };
  }, []);
  return <div ref={ref} className="game-canvas" role="application" aria-label="Community map. Drag to pan, scroll or pinch to zoom, arrow keys to move." />;
}
