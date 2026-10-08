import { useSyncExternalStore } from 'react';

export interface Store<T> {
  getState: () => T;
  setState: (patch: Partial<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

/** Minimal observable store usable from both React and Phaser. */
export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getState: () => state,
    setState: (patch) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); },
    subscribe: (l) => { listeners.add(l); return () => { listeners.delete(l); }; },
  };
}

export function useStore<T extends object, S>(store: Store<T>, selector: (s: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}
