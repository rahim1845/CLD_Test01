export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  jitter(amount: number): number;
  weighted<T>(items: [T, number][]): T;
}

/** 32-bit FNV-1a with an avalanche finish; stable across platforms. */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

export function createRng(key: string): Rng {
  let state = hashString(key) || 0x9e3779b9;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    jitter: (amount) => (next() * 2 - 1) * amount,
    weighted<T>(items: [T, number][]): T {
      const total = items.reduce((s, [, w]) => s + Math.max(0, w), 0);
      if (total <= 0) return items[0][0];
      let r = next() * total;
      for (const [item, w] of items) {
        r -= Math.max(0, w);
        if (r <= 0) return item;
      }
      return items[items.length - 1][0];
    },
  };
}
