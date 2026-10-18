/**
 * Remote image sources. Verified reachable 2026-07-10.
 * These are plain <Image source={{ uri }} /> URLs — the app itself never calls fetch().
 */

/** Real brand marks, resolved from the live favicon service. */
export const brandLogo = (domain: string) => ({
  uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
});

/**
 * smart.com.ph serves an SPA catch-all instead of a favicon, so no remote service can
 * resolve it — the favicon proxies all fall back to their own placeholder glyph. This is
 * the pinwheel cropped from Smart's official 2016 wordmark, bundled as a square asset.
 */
export const SMART_LOGO = require('../../assets/images/sponsors/smart.png') as number;

/** Deterministic stock photography — same seed always yields the same picture. */
export const photo = (seed: string, w = 640, h = 420) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Deterministic human portraits, 1..70. */
export const portrait = (n: number, size = 300) => `https://i.pravatar.cc/${size}?img=${n}`;
