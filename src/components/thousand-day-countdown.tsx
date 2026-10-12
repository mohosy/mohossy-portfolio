"use client";

import localFont from "next/font/local";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const minecraft = localFont({
  src: "../fonts/Minecraft.ttf",
  display: "block",
});

const TOTAL_SECONDS = 1000 * 86_400;
const STORAGE_KEY = "mohossy-count-started-at";

// The page and the downloaded clip are drawn by the same code at Reels size (9:16).
const FRAME_W = 1080;
const FRAME_H = 1920;
const CLIP_FPS = 30;
const CLIP_MS = 10_000;

// Small localStorage-backed values (start time, chosen style) that survive reloads.
function storedValue<T>(key: string, parse: (raw: string | null) => T, serialize: (value: T) => string | null) {
  let cache: { value: T } | undefined;
  const listeners = new Set<() => void>();
  return {
    read(): T {
      if (!cache) {
        try {
          cache = { value: parse(window.localStorage.getItem(key)) };
        } catch {
          cache = { value: parse(null) };
        }
      }
      return cache.value;
    },
    write(value: T) {
      cache = { value };
      try {
        const raw = serialize(value);
        if (raw === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, raw);
      } catch {
        // Storage blocked (private mode): the value still works until the tab closes.
      }
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

const startedAtStore = storedValue<number | null>(
  STORAGE_KEY,
  (raw) => (Number(raw) > 0 ? Number(raw) : null),
  (value) => (value === null ? null : String(value)),
);

const designStore = storedValue<Design>(
  "mohossy-count-design",
  (raw) => (raw && Object.hasOwn(builders, raw) ? (raw as Design) : "watch"),
  (value) => value,
);

const subscribeNoop = () => () => {};

// The count is a pure function of time since START, so any moment can be redrawn exactly.
function secondsLeftAt(elapsedMs: number) {
  return Math.max(0, TOTAL_SECONDS - Math.floor(Math.max(0, elapsedMs) / 1000));
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function dayNumber(seconds: number) {
  return Math.ceil(seconds / 86_400);
}

function hmsText(seconds: number) {
  return `${pad2(Math.floor((seconds % 86_400) / 3600))}:${pad2(Math.floor((seconds % 3600) / 60))}:${pad2(seconds % 60)}`;
}

// Soft, close-mic style clicks synthesized with Web Audio, so there is no sound file to load.
type Knock = { pitch: number; at?: number; gain?: number; decay?: number };

const SOUNDS = {
  tick: [{ pitch: 720 }],
  tock: [{ pitch: 610 }],
  minute: [{ pitch: 480, gain: 1.2, decay: 0.12 }],
  start: [{ pitch: 820 }, { pitch: 600, at: 0.08 }],
  reset: [{ pitch: 600 }, { pitch: 820, at: 0.08 }],
  done: [
    { pitch: 820 },
    { pitch: 720, at: 0.18 },
    { pitch: 610, at: 0.36 },
    { pitch: 480, at: 0.54, decay: 0.4 },
  ],
} satisfies Record<string, Knock[]>;

type SoundName = keyof typeof SOUNDS;

function soundFor(secondsLeft: number): SoundName {
  if (secondsLeft === 0) return "done";
  if (secondsLeft % 60 === 0) return "minute";
  return secondsLeft % 2 ? "tick" : "tock";
}

let noiseBuffer: AudioBuffer | null = null;

function getNoise(ctx: BaseAudioContext) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function playKnocks(
  ctx: BaseAudioContext,
  knocks: Knock[],
  startAt = ctx.currentTime,
  out: AudioNode = ctx.destination,
) {
  for (const { pitch: basePitch, at = 0, gain: baseGain = 1, decay = 0.06 } of knocks) {
    const t = startAt + at;
    // A little random wobble so it sounds like a real object, not a machine.
    const pitch = basePitch * (0.97 + Math.random() * 0.06);
    const gain = baseGain * (0.85 + Math.random() * 0.3);

    // Crisp transient: a few ms of filtered noise, like a fingernail tap.
    const noise = ctx.createBufferSource();
    noise.buffer = getNoise(ctx);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = pitch * 4;
    band.Q.value = 0.9;
    const noiseAmp = ctx.createGain();
    noiseAmp.gain.setValueAtTime(0.25 * gain, t);
    noiseAmp.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
    noise.connect(band).connect(noiseAmp).connect(out);
    noise.start(t);
    noise.stop(t + 0.03);

    // Woody body: a soft sine that drops in pitch and dies fast.
    const body = ctx.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(pitch, t);
    body.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + decay);
    const bodyAmp = ctx.createGain();
    bodyAmp.gain.setValueAtTime(0.0001, t);
    bodyAmp.gain.exponentialRampToValueAtTime(0.2 * gain, t + 0.003);
    bodyAmp.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    body.connect(bodyAmp).connect(out);
    body.start(t);
    body.stop(t + decay + 0.02);
  }
}

// Frame layout in 1080x1920 pixels, kept clear of the Reels caption and button overlays.
const LAYOUT = {
  days: { size: 96, y: 250, spacing: 6 },
  about: { size: 50, y: 340, spacing: 6 },
  hook: { size: 30, y: 400, spacing: 4 },
  hms: { size: 110, y: 1540 },
};

const INK = "#000";
const GOLD = "#F2B33D";
const GOLD_LIGHT = "#FFDB82";
const AMBER = "#C98600";

const ENTER_MS = 320;
const EXIT_MS = 220;
const COLLAPSE_MS = 300;

const backOut = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const easeOut = (p: number) => 1 - (1 - p) ** 2;

export type Design =
  | "bag"
  | "watch"
  | "champagne"
  | "bars"
  | "jet"
  | "crown"
  | "diamond"
  | "car"
  | "yacht"
  | "mansion"
  | "cash"
  | "chest"
  | "coin"
  | "piggy"
  | "briefcase"
  | "safe"
  | "trophy"
  | "tower"
  | "rocket"
  | "heli"
  | "bitcoin"
  | "card"
  | "chain"
  | "island"
  | "stocks";

type Point = [number, number];

type OverlayContext = {
  ctx: CanvasRenderingContext2D;
  fillCell: (c: number, r: number, color: string) => void;
  isBody: (c: number, r: number) => boolean;
  isEdge: (c: number, r: number) => boolean;
  surface: (c: number) => number;
  cellTop: (r: number) => number;
  seconds: number;
  waveMs: number;
};

// Pixel art is drawn as shapes on a tiny canvas, then read back as a grid of cells.
type Art = {
  cols: number;
  rows: number;
  cell: number;
  left: number;
  top: number;
  body: Uint8Array;
  ink: Uint8Array;
  fill?: string;
  shine?: string;
  overlay?: (o: OverlayContext) => void;
};

function rasterize(cols: number, rows: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const c = canvas.getContext("2d")!;
  c.fillStyle = c.strokeStyle = "#000";
  c.lineCap = c.lineJoin = "round";
  draw(c);
  const data = c.getImageData(0, 0, cols, rows).data;
  const grid = new Uint8Array(cols * rows);
  for (let i = 0; i < grid.length; i++) grid[i] = data[i * 4 + 3] > 110 ? 1 : 0;
  return grid;
}

function polygon(c: CanvasRenderingContext2D, points: Point[]) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
}

function disc(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry = rx) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
}

// Cut holes (windows, gems, a watch dial) out of a shape.
function erase(c: CanvasRenderingContext2D, draw: () => void) {
  c.globalCompositeOperation = "destination-out";
  draw();
  c.globalCompositeOperation = "source-over";
}

function bresenham(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// Crisp one-cell detail lines, rings and dots, so thin strokes never break up.
function inkGrid(cols: number, rows: number, paths: Point[][], extra?: (plot: (x: number, y: number) => void) => void) {
  const grid = new Uint8Array(cols * rows);
  const plot = (x: number, y: number) => {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < cols && y < rows) grid[y * cols + x] = 1;
  };
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      bresenham(Math.round(path[i][0]), Math.round(path[i][1]), Math.round(path[i + 1][0]), Math.round(path[i + 1][1]), plot);
    }
  }
  extra?.(plot);
  return grid;
}

function ring(plot: (x: number, y: number) => void, cx: number, cy: number, r: number) {
  for (let a = 0; a < Math.PI * 2; a += 0.5 / r) plot(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
}

function centered(cols: number, rows: number, cell: number) {
  return { cols, rows, cell, left: (FRAME_W - cols * cell) / 2, top: 955 - (rows * cell) / 2 };
}

function buildBag(): Art {
  const cols = 64;
  const rows = 64;
  const family = minecraft.style.fontFamily;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(25, 21);
    c.bezierCurveTo(11, 27, 5, 40, 7, 50);
    c.bezierCurveTo(8.5, 58, 18, 61.5, 32, 61.5);
    c.bezierCurveTo(46, 61.5, 55.5, 58, 57, 50);
    c.bezierCurveTo(59, 40, 53, 27, 39, 21);
    c.closePath();
    c.fill();
    c.fillRect(25, 14, 14, 8);
    c.beginPath();
    c.moveTo(26, 16);
    c.lineTo(19, 7);
    c.quadraticCurveTo(22.5, 4, 26, 7.5);
    c.quadraticCurveTo(29, 3.5, 32, 7);
    c.quadraticCurveTo(35, 3.5, 38, 7.5);
    c.quadraticCurveTo(41.5, 4, 45, 7);
    c.lineTo(38, 16);
    c.closePath();
    c.fill();
    c.fillRect(22, 14, 20, 5);
  });
  const ink = inkGrid(cols, rows, [
    [[22, 14], [41, 14], [41, 18], [22, 18], [22, 14]],
    [[29, 9], [29, 13]],
    [[35, 9], [35, 13]],
  ]);
  const sign = rasterize(cols, rows, (c) => {
    c.font = `24px ${family}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("$", 32, 42);
  });
  sign.forEach((on, i) => (ink[i] ||= on));
  return { ...centered(cols, rows, 13), body, ink };
}

// A gold watch: the band and case drain, the white dial keeps ticking.
function buildWatch(): Art {
  const cols = 64;
  const rows = 100;
  const cx = 32;
  const cy = 50;
  const body = rasterize(cols, rows, (c) => {
    polygon(c, [[23, 1], [41, 1], [43.5, 31], [20.5, 31]]);
    polygon(c, [[20.5, 69], [43.5, 69], [41, 99], [23, 99]]);
    disc(c, cx, cy, 22.5);
    c.fillRect(53, 46, 4, 8);
    erase(c, () => disc(c, cx, cy, 16.5));
  });
  const ink = inkGrid(
    cols,
    rows,
    [
      ...[7, 13, 19, 25].map((y): Point[] => [[23, y], [41, y]]),
      ...[75, 81, 87, 93].map((y): Point[] => [[23, y], [41, y]]),
      [[28, 1], [28, 28]],
      [[36, 1], [36, 28]],
      [[28, 72], [28, 99]],
      [[36, 72], [36, 99]],
      [[cx, cy], [cx - 6, cy - 4]], // hour hand at 10
      [[cx, cy], [cx + 9, cy - 6]], // minute hand at 2
    ],
    (plot) => {
      ring(plot, cx, cy, 19.5);
      for (let h = 0; h < 12; h++) {
        const a = (h / 12) * Math.PI * 2;
        plot(cx + Math.sin(a) * 14, cy - Math.cos(a) * 14);
        if (h % 3 === 0) plot(cx + Math.sin(a) * 13, cy - Math.cos(a) * 13);
      }
      plot(cx + 1, cy);
      plot(cx, cy + 1);
      plot(cx + 1, cy + 1);
    },
  );
  return {
    ...centered(cols, rows, 9),
    body,
    ink,
    overlay: ({ fillCell, seconds }) => {
      // A gold crown between the center and 6 o'clock, luxury-watch style, under the hands.
      ["X..X.X.X..X", ".X.X.X.X.X.", ".XXXXXXXXX.", ".XXXXXXXXX.", ".X.X.X.X.X.", ".XXXXXXXXX."].forEach((row, r) =>
        [...row].forEach((on, c) => on === "X" && fillCell(cx - 5 + c, 54 + r, AMBER)),
      );
      // The second hand sweeps once a minute, over the crown.
      const a = ((60 - (seconds % 60)) / 60) * Math.PI * 2;
      bresenham(cx, cy, Math.round(cx + Math.sin(a) * 15), Math.round(cy - Math.cos(a) * 15), (x, y) =>
        fillCell(x, y, INK),
      );
    },
  };
}

// A champagne flute: the bubbly drains and bubbles keep rising.
function buildChampagne(): Art {
  const cols = 48;
  const rows = 100;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(11, 2);
    c.lineTo(37, 2);
    c.quadraticCurveTo(36.5, 44, 33, 53);
    c.quadraticCurveTo(29, 63, 24, 64);
    c.quadraticCurveTo(19, 63, 15, 53);
    c.quadraticCurveTo(11.5, 44, 11, 2);
    c.closePath();
    c.fill();
  });
  const glass = rasterize(cols, rows, (c) => {
    c.fillRect(23, 63, 2, 28);
    polygon(c, [[17, 90], [31, 90], [36, 94], [12, 94]]);
  });
  const ink = inkGrid(cols, rows, []);
  glass.forEach((on, i) => (ink[i] ||= on));
  const bubbles = Array.from({ length: 16 }, (_, i) => ({
    col: 15 + ((i * 7) % 19),
    speed: 4 + ((i * 5) % 7),
    phase: (i * 13) % 50,
  }));
  return {
    ...centered(cols, rows, 9),
    body,
    ink,
    overlay: ({ fillCell, isBody, isEdge, surface, cellTop, waveMs }) => {
      for (const { col, speed, phase } of bubbles) {
        const r = 60 - Math.floor(((waveMs / 1000) * speed + phase) % 56);
        if (isBody(col, r) && !isEdge(col, r) && cellTop(r) > surface(col)) fillCell(col, r, "#FFF4CF");
      }
      for (let r = 8; r < 40; r++) if (isBody(14, r) && !isEdge(14, r)) fillCell(14, r, "rgba(255,255,255,0.5)");
    },
  };
}

// A pyramid of gold bars; the top bar runs out first.
function buildBars(): Art {
  const cols = 72;
  const rows = 46;
  const bars: Point[][] = [];
  for (let row = 0; row < 4; row++) {
    const count = 4 - row;
    const y = 36 - row * 10;
    for (let i = 0; i < count; i++) {
      const x = 4 + row * 8 + i * 16;
      bars.push([[x, y + 9], [x + 16, y + 9], [x + 13, y], [x + 3, y]]);
    }
  }
  const body = rasterize(cols, rows, (c) => bars.forEach((bar) => polygon(c, bar)));
  const ink = inkGrid(cols, rows, [
    ...bars.map((bar): Point[] => [...bar, bar[0]]),
    ...bars.map(([, , , [x, y]]): Point[] => [[x + 3, y + 4], [x + 7, y + 4]]),
  ]);
  return { ...centered(cols, rows, 12), body, ink };
}

// A private jet in profile, windows and all.
function buildJet(): Art {
  const cols = 100;
  const rows = 40;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(18, 13);
    c.lineTo(80, 13);
    c.quadraticCurveTo(96, 15, 97.5, 21);
    c.quadraticCurveTo(95, 27.5, 84, 28);
    c.lineTo(28, 28);
    c.quadraticCurveTo(14, 27, 6, 19);
    c.lineTo(8, 16);
    c.quadraticCurveTo(12, 13, 18, 13);
    c.fill();
    polygon(c, [[7, 17], [4, 2], [10, 2], [23, 13]]);
    c.fillRect(1, 1, 15, 3);
    disc(c, 27, 11, 7.5, 3.4);
    polygon(c, [[42, 26], [57, 26], [47, 35], [38, 35]]);
    erase(c, () => {
      for (let x = 34; x <= 70; x += 6) c.fillRect(x, 17, 2, 3);
      polygon(c, [[85, 16.5], [90, 16.5], [93, 20], [85, 20]]);
    });
  });
  const ink = inkGrid(cols, rows, [
    [[75, 16], [75, 26]],
    [[79, 16], [79, 26]],
    [[75, 16], [79, 16]],
    [[21, 11], [33, 11]],
  ]);
  return { ...centered(cols, rows, 9), body, ink };
}

// A king's crown with gem holes in the band and the center spike.
function buildCrown(): Art {
  const cols = 64;
  const rows = 48;
  const tips: Point[] = [[6, 11], [19, 8], [32, 5], [45, 8], [58, 11]];
  const body = rasterize(cols, rows, (c) => {
    polygon(c, [[8, 36], tips[0], [12.5, 25], tips[1], [25.5, 25], tips[2], [38.5, 25], tips[3], [51.5, 25], tips[4], [56, 36]]);
    tips.forEach(([x, y], i) => disc(c, x, y - 2, i === 2 ? 3 : 2.5));
    c.fillRect(7, 35, 50, 11);
    erase(c, () => {
      disc(c, 20, 40.5, 2.4);
      disc(c, 32, 40.5, 3);
      disc(c, 44, 40.5, 2.4);
      disc(c, 32, 18, 2.4);
    });
  });
  const ink = inkGrid(cols, rows, [[[8, 35], [56, 35]]]);
  return { ...centered(cols, rows, 13), body, ink };
}

// A cut diamond with facet lines; this one fills with icy blue instead of gold.
function buildDiamond(): Art {
  const cols = 64;
  const rows = 54;
  const body = rasterize(cols, rows, (c) => polygon(c, [[18, 3], [46, 3], [61, 17], [32, 52], [3, 17]]));
  const ink = inkGrid(cols, rows, [
    [[3, 17], [61, 17]],
    [[18, 3], [11, 17]],
    [[18, 3], [25, 17]],
    [[32, 3], [25, 17]],
    [[32, 3], [39, 17]],
    [[46, 3], [39, 17]],
    [[46, 3], [53, 17]],
    [[11, 17], [32, 52]],
    [[25, 17], [32, 52]],
    [[39, 17], [32, 52]],
    [[53, 17], [32, 52]],
  ]);
  return { ...centered(cols, rows, 13), body, ink, fill: "#7FD3F0", shine: "#CDF2FF" };
}

// A low supercar in profile; the wheels and windows stay out of the fill.
function buildCar(): Art {
  const cols = 100;
  const rows = 36;
  const wheels: Point[] = [[21, 27], [79, 27]];
  const body = rasterize(cols, rows, (c) => {
    polygon(c, [[3, 28], [3, 20], [11, 16.5], [31, 14.5], [41, 8], [58, 7], [71, 14.5], [91, 18.5], [97.5, 22.5], [96.5, 28]]);
    c.fillRect(2, 12.5, 9, 2.5);
    c.fillRect(7, 14, 2, 3);
    erase(c, () => {
      wheels.forEach(([x, y]) => disc(c, x, y, 7.6));
      polygon(c, [[41, 10.5], [57, 9.5], [66.5, 15], [36.5, 15.5]]);
    });
  });
  const ink = inkGrid(
    cols,
    rows,
    [
      [[50, 10], [50, 15]],
      [[48, 16], [47, 26]],
      [[33, 20], [41, 20]],
      [[92, 21], [95, 21]],
    ],
    (plot) =>
      wheels.forEach(([x, y]) => {
        ring(plot, x, y, 6);
        ring(plot, x, y, 5.3);
        ring(plot, x, y, 2);
        plot(x, y);
      }),
  );
  return { ...centered(cols, rows, 9), body, ink };
}

// A three-deck superyacht.
function buildYacht(): Art {
  const cols = 100;
  const rows = 46;
  const body = rasterize(cols, rows, (c) => {
    polygon(c, [[5, 30], [92, 30], [99, 27], [88, 42], [14, 42], [5, 36]]);
    polygon(c, [[17, 30.5], [20, 21], [70, 21], [81, 30.5]]);
    polygon(c, [[29, 21.5], [32, 14], [60, 14], [67, 21.5]]);
    polygon(c, [[40, 14.5], [42, 9], [54, 9], [57, 14.5]]);
    erase(c, () => {
      c.fillRect(24, 24, 48, 3);
      c.fillRect(36, 16, 23, 2.5);
      for (let x = 28; x <= 80; x += 8) disc(c, x, 35, 1.3);
    });
  });
  const ink = inkGrid(cols, rows, [
    [[48, 9], [48, 3]],
    [[45, 4], [51, 4]],
    [[5, 30], [92, 30]],
  ]);
  return { ...centered(cols, rows, 9), body, ink };
}

// A columned mansion.
function buildMansion(): Art {
  const cols = 80;
  const rows = 56;
  const body = rasterize(cols, rows, (c) => {
    c.fillRect(8, 24, 64, 31);
    c.fillRect(6, 21, 68, 4);
    polygon(c, [[23, 22], [40, 7], [57, 22]]);
    c.fillRect(13, 13, 5, 9);
    c.fillRect(62, 13, 5, 9);
    erase(c, () => {
      for (const x of [11, 18, 57, 64]) for (const y of [29, 41]) c.fillRect(x, y, 5, 7);
      c.fillRect(36, 41, 8, 14);
      disc(c, 40, 41, 4);
      disc(c, 40, 16, 2.5);
    });
  });
  const ink = inkGrid(cols, rows, [
    ...[26, 29, 32, 48, 51, 54].map((x): Point[] => [[x, 25], [x, 51]]),
    [[24, 25], [56, 25]],
    [[22, 52], [58, 52]],
    [[20, 54], [60, 54]],
    [[8, 25], [72, 25]],
  ]);
  return { ...centered(cols, rows, 11), body, ink };
}

// A thick stack of $100 bills with a paper band; this one fills with cash green.
function buildCash(): Art {
  const cols = 64;
  const rows = 60;
  const family = minecraft.style.fontFamily;
  const body = rasterize(cols, rows, (c) => {
    polygon(c, [[8, 14], [14, 5], [62, 5], [56, 14]]);
    c.fillRect(8, 14, 49, 44);
    polygon(c, [[56, 14], [62, 5], [62, 49], [56, 58]]);
  });
  const ink = inkGrid(cols, rows, [
    ...Array.from({ length: 14 }, (_, i): Point[] => [[9, 17 + i * 3], [27, 17 + i * 3]]),
    ...Array.from({ length: 14 }, (_, i): Point[] => [[37, 17 + i * 3], [55, 17 + i * 3]]),
    [[28, 14], [28, 57]],
    [[36, 14], [36, 57]],
    [[56, 14], [56, 58]],
    [[8, 14], [56, 14]],
    [[17, 7], [57, 7], [53, 12], [13, 12], [17, 7]],
  ]);
  const sign = rasterize(cols, rows, (c) => {
    c.font = `10px ${family}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("$", 32, 33);
  });
  sign.forEach((on, i) => (ink[i] ||= on));
  return { ...centered(cols, rows, 13), body, ink, fill: "#5DBB63", shine: "#A9E5A6" };
}

// A treasure chest with iron bands and a lock.
function buildChest(): Art {
  const cols = 72;
  const rows = 56;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(8, 28);
    c.lineTo(8, 17);
    c.quadraticCurveTo(36, 1, 64, 17);
    c.lineTo(64, 28);
    c.closePath();
    c.fill();
    c.fillRect(8, 28, 57, 26);
    erase(c, () => c.fillRect(33, 31, 1, 3));
  });
  const ink = inkGrid(cols, rows, [
    [[8, 28], [64, 28]],
    [[16, 12], [16, 53]],
    [[19, 11], [19, 53]],
    [[53, 11], [53, 53]],
    [[56, 12], [56, 53]],
    [[31, 25], [41, 25], [41, 35], [31, 35], [31, 25]],
    [[36, 29], [36, 32]],
  ]);
  return { ...centered(cols, rows, 12), body, ink };
}

// A big gold coin with a milled rim.
function buildCoin(): Art {
  const cols = 64;
  const rows = 64;
  const family = minecraft.style.fontFamily;
  const body = rasterize(cols, rows, (c) => disc(c, 32, 32, 30));
  const ink = inkGrid(cols, rows, [], (plot) => {
    ring(plot, 32, 32, 24.5);
    for (let a = 0; a < 360; a += 12) {
      const r = (a * Math.PI) / 180;
      plot(32 + Math.cos(r) * 27.5, 32 + Math.sin(r) * 27.5);
    }
  });
  const sign = rasterize(cols, rows, (c) => {
    c.font = `30px ${family}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("$", 32, 33);
  });
  sign.forEach((on, i) => (ink[i] ||= on));
  return { ...centered(cols, rows, 13), body, ink };
}

function signGrid(cols: number, rows: number, text: string, size: number, x: number, y: number) {
  const family = minecraft.style.fontFamily;
  return rasterize(cols, rows, (c) => {
    c.font = `${size}px ${family}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, x, y);
  });
}

function merge(target: Uint8Array, ...grids: Uint8Array[]) {
  grids.forEach((grid) => grid.forEach((on, i) => (target[i] ||= on)));
  return target;
}

// A gold piggy bank with a coin slot.
function buildPiggy(): Art {
  const cols = 72;
  const rows = 56;
  const body = rasterize(cols, rows, (c) => {
    disc(c, 34, 30, 26, 18.5);
    disc(c, 62, 30, 5.5);
    polygon(c, [[43, 15], [49, 4], [54, 16]]);
    c.fillRect(15, 42, 7, 12);
    c.fillRect(24, 44, 7, 10);
    c.fillRect(41, 44, 7, 10);
    c.fillRect(50, 42, 7, 12);
    disc(c, 7, 27, 2.5);
    erase(c, () => c.fillRect(29, 12.5, 11, 2));
  });
  const ink = inkGrid(cols, rows, [[[47, 13], [50, 8]]], (plot) => {
    ring(plot, 62, 30, 4.6);
    plot(61, 29);
    plot(63, 31);
    plot(52, 24);
    plot(53, 24);
  });
  return { ...centered(cols, rows, 12), body, ink };
}

// A briefcase of cash.
function buildBriefcase(): Art {
  const cols = 72;
  const rows = 56;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.roundRect(5, 16, 62, 37, 4);
    c.fill();
    c.fillRect(25, 5, 22, 12);
    erase(c, () => c.fillRect(29.5, 9, 13, 8));
  });
  const ink = merge(
    inkGrid(cols, rows, [
      [[5, 25], [66, 25]],
      [[16, 22], [21, 22], [21, 28], [16, 28], [16, 22]],
      [[51, 22], [56, 22], [56, 28], [51, 28], [51, 22]],
    ]),
    signGrid(cols, rows, "$", 16, 36, 39),
  );
  return { ...centered(cols, rows, 12), body, ink };
}

// A bank safe with a vault wheel.
function buildSafe(): Art {
  const cols = 64;
  const rows = 66;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.roundRect(5, 3, 54, 55, 3);
    c.fill();
    c.fillRect(10, 57, 7, 7);
    c.fillRect(47, 57, 7, 7);
  });
  const ink = inkGrid(
    cols,
    rows,
    [
      [[11, 9], [53, 9], [53, 52], [11, 52], [11, 9]],
      [[7, 15], [7, 22]],
      [[7, 39], [7, 46]],
      [[32, 18], [32, 44]],
      [[19, 31], [45, 31]],
      [[23, 22], [41, 40]],
      [[41, 22], [23, 40]],
    ],
    (plot) => {
      ring(plot, 32, 31, 9.5);
      ring(plot, 32, 31, 4);
      [[32, 18], [32, 44], [19, 31], [45, 31]].forEach(([x, y]) => {
        plot(x - 1, y);
        plot(x + 1, y);
        plot(x, y - 1);
        plot(x, y + 1);
      });
    },
  );
  return { ...centered(cols, rows, 13), body, ink };
}

// A winner's trophy cup.
function buildTrophy(): Art {
  const cols = 64;
  const rows = 80;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(14, 4);
    c.lineTo(50, 4);
    c.bezierCurveTo(50, 26, 44, 36, 36, 40);
    c.lineTo(28, 40);
    c.bezierCurveTo(20, 36, 14, 26, 14, 4);
    c.fill();
    c.lineWidth = 3.4;
    c.beginPath();
    c.arc(14, 16, 7.5, Math.PI / 2, Math.PI * 1.5);
    c.stroke();
    c.beginPath();
    c.arc(50, 16, 7.5, -Math.PI / 2, Math.PI / 2);
    c.stroke();
    c.fillRect(29, 39, 6, 16);
    polygon(c, [[22, 54], [42, 54], [46, 62], [18, 62]]);
    c.fillRect(14, 61, 36, 13);
  });
  const ink = merge(
    inkGrid(cols, rows, [
      [[14, 8], [50, 8]],
      [[20, 65], [43, 65], [43, 70], [20, 70], [20, 65]],
    ]),
    signGrid(cols, rows, "1", 18, 32, 22),
  );
  return { ...centered(cols, rows, 11), body, ink };
}

// Your own skyscraper.
function buildTower(): Art {
  const cols = 64;
  const rows = 100;
  const body = rasterize(cols, rows, (c) => {
    c.fillRect(20, 14, 24, 85);
    c.fillRect(24, 6, 16, 9);
    c.fillRect(31, 0, 2, 7);
    c.fillRect(8, 50, 13, 49);
    c.fillRect(43, 40, 13, 59);
    erase(c, () => {
      for (let y = 18; y <= 86; y += 5) for (let x = 23; x <= 39; x += 4) c.fillRect(x, y, 2, 2);
      for (let y = 54; y <= 92; y += 5) for (const x of [11, 15]) c.fillRect(x, y, 2, 2);
      for (let y = 44; y <= 92; y += 5) for (const x of [46, 50]) c.fillRect(x, y, 2, 2);
      for (let x = 27; x <= 35; x += 4) c.fillRect(x, 9, 2, 2);
      c.fillRect(29, 91, 6, 8);
    });
  });
  const ink = inkGrid(cols, rows, []);
  return { ...centered(cols, rows, 9), body, ink };
}

// A rocket with a flickering flame, for the billionaire space race.
function buildRocket(): Art {
  const cols = 56;
  const rows = 100;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.moveTo(18, 30);
    c.quadraticCurveTo(18, 12, 28, 2);
    c.quadraticCurveTo(38, 12, 38, 30);
    c.fill();
    c.fillRect(18, 29, 20, 50);
    polygon(c, [[18.5, 56], [6, 78], [6, 88], [18.5, 80]]);
    polygon(c, [[37.5, 56], [50, 78], [50, 88], [37.5, 80]]);
    polygon(c, [[21, 78], [35, 78], [37, 85], [19, 85]]);
    erase(c, () => disc(c, 28, 38, 4.5));
  });
  const ink = inkGrid(
    cols,
    rows,
    [
      [[18, 29], [37, 29]],
      [[18, 66], [37, 66]],
    ],
    (plot) => ring(plot, 28, 38, 6),
  );
  return {
    ...centered(cols, rows, 9),
    body,
    ink,
    overlay: ({ fillCell, waveMs }) => {
      const flicker = (waveMs / 90) | 0;
      for (let r = 86; r < 99; r++) {
        const half = Math.max(0, 7 - (r - 86) * 0.55 + (((flicker + r) % 3) - 1) * 0.8);
        for (let c = Math.round(28 - half); c <= Math.round(27 + half); c++) {
          fillCell(c, r, Math.abs(c - 27.5) < half * 0.45 ? "#FFE27A" : "#FF8A1F");
        }
      }
    },
  };
}

// A helicopter whose main rotor keeps spinning.
function buildHeli(): Art {
  const cols = 100;
  const rows = 48;
  const body = rasterize(cols, rows, (c) => {
    disc(c, 60, 27, 20, 11);
    polygon(c, [[42, 22], [8, 24.5], [8, 28.5], [44, 31]]);
    polygon(c, [[4, 14], [11, 14], [12, 30], [5, 30]]);
    c.fillRect(57.5, 10, 5, 7);
    erase(c, () => {
      polygon(c, [[67, 18], [77, 21], [79.5, 27], [67, 27]]);
      c.fillRect(51, 20, 10, 6);
    });
  });
  const ink = inkGrid(cols, rows, [
    [[44, 44], [82, 44], [84, 42]],
    [[51, 38], [51, 44]],
    [[71, 38], [71, 44]],
    [[8, 26], [42, 26]],
  ]);
  return {
    ...centered(cols, rows, 9),
    body,
    ink,
    overlay: ({ fillCell, waveMs }) => {
      // Seen from the side, a spinning rotor looks like a bar that grows and shrinks.
      const half = Math.round(4 + 34 * Math.abs(Math.cos(waveMs / 120)));
      for (let c = 60 - half; c <= 60 + half; c++) fillCell(c, 8, INK);
      for (let r = 9; r < 10; r++) fillCell(60, r, INK);
      const tail = Math.round(1 + 4 * Math.abs(Math.sin(waveMs / 80)));
      for (let r = 22 - tail; r <= 22 + tail; r++) fillCell(8, r, INK);
    },
  };
}

// A bitcoin, in bitcoin orange.
function buildBitcoin(): Art {
  const cols = 64;
  const rows = 64;
  const body = rasterize(cols, rows, (c) => disc(c, 32, 32, 30));
  const ink = merge(
    inkGrid(
      cols,
      rows,
      [
        [[29, 12], [29, 16]],
        [[34, 12], [34, 16]],
        [[29, 48], [29, 52]],
        [[34, 48], [34, 52]],
      ],
      (plot) => ring(plot, 32, 32, 25),
    ),
    signGrid(cols, rows, "B", 26, 32, 32),
  );
  return { ...centered(cols, rows, 13), body, ink, fill: "#F7931A", shine: "#FFC46B" };
}

// A gold credit card.
function buildCard(): Art {
  const cols = 80;
  const rows = 52;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.roundRect(4, 6, 72, 44, 4);
    c.fill();
  });
  const dots = (plot: (x: number, y: number) => void) => {
    for (let g = 0; g < 4; g++) for (let d = 0; d < 4; d++) plot(11 + g * 16 + d * 3, 36);
  };
  const ink = merge(
    inkGrid(
      cols,
      rows,
      [
        [[11, 17], [22, 17], [22, 27], [11, 27], [11, 17]],
        [[11, 22], [22, 22]],
        [[16, 17], [16, 27]],
      ],
      dots,
    ),
    signGrid(cols, rows, "MO", 8, 16, 44),
  );
  return { ...centered(cols, rows, 11), body, ink };
}

// A gold chain with a big $ pendant.
function buildChain(): Art {
  const cols = 64;
  const rows = 84;
  const body = rasterize(cols, rows, (c) => {
    c.lineWidth = 3.5;
    c.beginPath();
    c.moveTo(10, 2);
    c.quadraticCurveTo(14, 44, 32, 44);
    c.quadraticCurveTo(50, 44, 54, 2);
    c.stroke();
    c.fillRect(29, 43, 6, 6);
    disc(c, 32, 64, 17);
  });
  const ink = merge(
    inkGrid(cols, rows, [], (plot) => {
      for (let t = 0.04; t < 1; t += 0.07) {
        const x = (1 - t) ** 2 * 10 + 2 * (1 - t) * t * 14 + t * t * 32;
        const y = (1 - t) ** 2 * 2 + 2 * (1 - t) * t * 44 + t * t * 44;
        plot(x, y);
        plot(64 - x, y);
      }
      ring(plot, 32, 64, 13.5);
    }),
    signGrid(cols, rows, "$", 20, 32, 65),
  );
  return { ...centered(cols, rows, 11), body, ink };
}

// A private island with a palm tree, on gently moving water.
function buildIsland(): Art {
  const cols = 100;
  const rows = 64;
  const body = rasterize(cols, rows, (c) => {
    c.beginPath();
    c.ellipse(50, 52, 36, 11, 0, Math.PI, 0);
    c.fill();
    c.lineWidth = 3.4;
    c.beginPath();
    c.moveTo(46, 46);
    c.quadraticCurveTo(46, 26, 56, 14);
    c.stroke();
    // Drooping palm fronds.
    c.lineWidth = 3;
    for (const [cx, cy, x, y] of [[44, 6, 34, 22], [68, 6, 78, 22], [46, 2, 38, 10], [66, 2, 74, 10], [56, 2, 58, 4]]) {
      c.beginPath();
      c.moveTo(56, 14);
      c.quadraticCurveTo(cx, cy, x, y);
      c.stroke();
    }
    disc(c, 54, 18, 2.4);
    disc(c, 58.5, 18.5, 2.4);
  });
  const ink = inkGrid(cols, rows, [[[14, 52], [86, 52]]]);
  return {
    ...centered(cols, rows, 9),
    body,
    ink,
    overlay: ({ fillCell, waveMs }) => {
      for (let row = 0; row < 3; row++) {
        const r = 55 + row * 3;
        const shift = Math.floor(waveMs / 250 + row * 3) % 8;
        for (let c = 4 + ((shift + row * 2) % 8); c < 96; c += 8) {
          fillCell(c, r, INK);
          fillCell(c + 1, r - 1, INK);
          fillCell(c + 2, r, INK);
        }
      }
    },
  };
}

// A stock chart going up, gold under the line.
function buildStocks(): Art {
  const cols = 80;
  const rows = 64;
  const line: Point[] = [[7, 52], [19, 43], [29, 47], [41, 31], [51, 36], [63, 18], [72, 9]];
  const body = rasterize(cols, rows, (c) => polygon(c, [...line, [72, 57], [7, 57]]));
  const ink = inkGrid(cols, rows, [
    [[5, 3], [5, 58], [77, 58]],
    line,
    [[66, 9], [73, 8], [72, 15]],
  ]);
  return { ...centered(cols, rows, 11), body, ink };
}

const builders: Record<Design, () => Art> = {
  bag: buildBag,
  watch: buildWatch,
  champagne: buildChampagne,
  bars: buildBars,
  jet: buildJet,
  crown: buildCrown,
  diamond: buildDiamond,
  car: buildCar,
  yacht: buildYacht,
  mansion: buildMansion,
  cash: buildCash,
  chest: buildChest,
  coin: buildCoin,
  piggy: buildPiggy,
  briefcase: buildBriefcase,
  safe: buildSafe,
  trophy: buildTrophy,
  tower: buildTower,
  rocket: buildRocket,
  heli: buildHeli,
  bitcoin: buildBitcoin,
  card: buildCard,
  chain: buildChain,
  island: buildIsland,
  stocks: buildStocks,
};

const artCache = new Map<Design, Art>();

function getArt(design: Design) {
  let art = artCache.get(design);
  if (!art) {
    art = builders[design]();
    artCache.set(design, art);
  }
  return art;
}

// The fill covers `fraction` of the art's height; its surface waves column by column.
function drawArt(ctx: CanvasRenderingContext2D, art: Art, fraction: number, seconds: number, waveMs: number) {
  const { cols, rows, cell, left, top, body, ink, fill = GOLD, shine = GOLD_LIGHT } = art;
  let firstRow = rows;
  let lastRow = 0;
  for (let i = 0; i < body.length; i++) {
    if (!body[i]) continue;
    firstRow = Math.min(firstRow, Math.floor(i / cols));
    lastRow = Math.max(lastRow, Math.floor(i / cols));
  }
  const artTop = top + firstRow * cell;
  const artHeight = (lastRow - firstRow + 1) * cell;
  const level = artTop + (1 - fraction) * artHeight;
  const amplitude = fraction > 0 && fraction < 1 ? cell * 0.45 : 0;
  const isBody = (c: number, r: number) => c >= 0 && r >= 0 && c < cols && r < rows && body[r * cols + c] === 1;
  const isEdge = (c: number, r: number) =>
    isBody(c, r) && (!isBody(c - 1, r) || !isBody(c + 1, r) || !isBody(c, r - 1) || !isBody(c, r + 1));
  const surfaces = Array.from(
    { length: cols },
    (_, c) => level + amplitude * Math.sin(((left + c * cell) / 260) * Math.PI * 2 + (waveMs / 1600) * Math.PI * 2),
  );
  const fillCell = (c: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(left + c * cell, top + r * cell, cell, cell);
  };

  for (let c = 0; c < cols; c++) {
    const x = left + c * cell;
    const surface = surfaces[c];
    for (let r = 0; r < rows; r++) {
      const y = top + r * cell;
      if (ink[r * cols + c] || isEdge(c, r)) {
        fillCell(c, r, INK);
        continue;
      }
      if (!isBody(c, r) || y + cell <= surface) continue;
      const from = Math.max(y, surface);
      ctx.fillStyle = fill;
      ctx.fillRect(x, from, cell, y + cell - from);
      if (surface > y - cell * 0.5) {
        ctx.fillStyle = shine;
        ctx.fillRect(x, from, cell, Math.min(cell * 0.5, y + cell - from));
      }
    }
  }
  art.overlay?.({
    ctx,
    fillCell,
    isBody,
    isEdge,
    surface: (c) => surfaces[c] ?? level,
    cellTop: (r) => top + r * cell,
    seconds,
    waveMs,
  });
}

function spacedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number) {
  return [...text].reduce((w, char) => w + ctx.measureText(char).width, 0) + spacing * (text.length - 1);
}

function drawSpacedFrom(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  ctx.textAlign = "left";
  for (const char of text) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + spacing;
  }
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  drawSpacedFrom(ctx, text, cx - spacedWidth(ctx, text, spacing) / 2, y, spacing);
}

type Slot = { x: number; w: number };

// Each character sits in its own clipped slot; a changed digit rolls down into place.
function drawRollingRow(
  ctx: CanvasRenderingContext2D,
  current: string,
  previous: string,
  sinceMs: number | null,
  baseline: number,
) {
  const zero = ctx.measureText("0");
  const pad = parseFloat(ctx.font) * 0.05;
  const digitW = zero.width + pad * 2;
  const colonW = ctx.measureText(":").width + pad * 2;
  const top = baseline - zero.actualBoundingBoxAscent - pad * 2;
  const height = zero.actualBoundingBoxAscent + pad * 4;

  // Old and new text are aligned from the right, so a shorter number collapses the leading slot.
  const n = Math.max(current.length, previous.length);
  const chars = Array.from({ length: n }, (_, i) => ({
    now: current[current.length - n + i] as string | undefined,
    before: previous[previous.length - n + i] as string | undefined,
  }));
  const widths = chars.map(({ now, before }) => {
    const full = (now ?? before) === ":" ? colonW : digitW;
    if (now !== undefined && before !== undefined) return full;
    const p = sinceMs === null ? 1 : easeOut(Math.min(1, sinceMs / COLLAPSE_MS));
    return now === undefined ? full * (1 - p) : full * p;
  });

  let x = (FRAME_W - widths.reduce((sum, w) => sum + w, 0)) / 2;
  ctx.textAlign = "center";
  return chars.map(({ now, before }, i): Slot => {
    const w = widths[i];
    const cx = x + w / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, top, w, height);
    ctx.clip();
    if (sinceMs === null || now === before) {
      if (now !== undefined) ctx.fillText(now, cx, baseline);
    } else {
      if (before !== undefined && sinceMs < EXIT_MS) {
        ctx.fillText(before, cx, baseline + (sinceMs / EXIT_MS) ** 2 * height);
      }
      if (now !== undefined) {
        const p = Math.min(1, sinceMs / ENTER_MS);
        ctx.fillText(now, cx, baseline - (1 - backOut(p)) * height);
      }
    }
    ctx.restore();
    const slot = { x, w };
    x += w;
    return slot;
  });
}

type FrameState = { seconds: number; before: number; sinceMs: number | null; waveMs: number };

function frameStateAt(elapsedMs: number, animate: boolean): FrameState {
  const tick = Math.floor(Math.max(0, elapsedMs) / 1000);
  const seconds = secondsLeftAt(elapsedMs);
  const before = tick > 0 ? secondsLeftAt(tick * 1000 - 1) : seconds;
  return { seconds, before, sinceMs: animate && before !== seconds ? elapsedMs - tick * 1000 : null, waveMs: elapsedMs };
}

function drawFrame(ctx: CanvasRenderingContext2D, design: Design, { seconds, before, sinceMs, waveMs }: FrameState) {
  const family = minecraft.style.fontFamily;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  ctx.textBaseline = "alphabetic";

  const { days, about, hook, hms } = LAYOUT;
  const dayCount = dayNumber(seconds);
  ctx.font = `${days.size}px ${family}`;
  const number = String(dayCount);
  const rest = dayCount === 1 ? " DAY LEFT" : " DAYS LEFT";
  const numberW = spacedWidth(ctx, number, days.spacing) + days.spacing;
  const x = (FRAME_W - numberW - spacedWidth(ctx, rest, days.spacing)) / 2;
  ctx.fillStyle = AMBER;
  drawSpacedFrom(ctx, number, x, days.y, days.spacing);
  ctx.fillStyle = INK;
  drawSpacedFrom(ctx, rest, x + numberW, days.y, days.spacing);
  ctx.font = `${about.size}px ${family}`;
  drawSpaced(ctx, "TO BECOME A BILLIONAIRE", FRAME_W / 2, about.y, about.spacing);
  ctx.font = `${hook.size}px ${family}`;
  ctx.fillStyle = "#6b6b6b";
  drawSpaced(ctx, "(OR SOMETHING HUGE WILL HAPPEN)", FRAME_W / 2, hook.y, hook.spacing);

  drawArt(ctx, getArt(design), seconds / TOTAL_SECONDS, seconds, waveMs);

  ctx.fillStyle = INK;
  ctx.font = `${hms.size}px ${family}`;
  drawRollingRow(ctx, hmsText(seconds), hmsText(before), sinceMs, hms.y);
}

// "Last 10 seconds": ends just before the latest tick, so the clip has 10 evenly spaced ticks.
function clipStartMs(elapsedMs: number) {
  return Math.max(0, Math.floor(elapsedMs / 1000) * 1000 - 500 - CLIP_MS);
}

async function renderClipAudio(startMs: number) {
  const rate = 48_000;
  const ctx = new OfflineAudioContext(2, (rate * CLIP_MS) / 1000, rate);
  // Louder than the live page so the ticks carry on a phone speaker.
  const out = ctx.createGain();
  out.gain.value = 1.8;
  out.connect(ctx.destination);
  if (startMs === 0) playKnocks(ctx, SOUNDS.start, 0, out);
  for (let t = Math.max(1000, Math.ceil(startMs / 1000) * 1000); t < startMs + CLIP_MS; t += 1000) {
    const left = secondsLeftAt(t);
    if (left < secondsLeftAt(t - 1)) playKnocks(ctx, SOUNDS[soundFor(left)], (t - startMs) / 1000, out);
  }
  return ctx.startRendering();
}

let aacFallbackRegistered = false;

async function renderClip(design: Design, startMs: number, onProgress: (fraction: number) => void) {
  const mb = await import("mediabunny");
  if (typeof VideoEncoder === "undefined" || !(await mb.canEncodeVideo("avc", { width: FRAME_W, height: FRAME_H }))) {
    throw new Error("This browser can't make videos. Try Chrome or Safari.");
  }
  if (!aacFallbackRegistered && !(await mb.canEncodeAudio("aac"))) {
    const { registerAacEncoder } = await import("@mediabunny/aac-encoder");
    registerAacEncoder();
    aacFallbackRegistered = true;
  }

  const canvas = document.createElement("canvas");
  canvas.width = FRAME_W;
  canvas.height = FRAME_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't start the video renderer.");

  const output = new mb.Output({
    format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
    target: new mb.BufferTarget(),
  });
  const video = new mb.CanvasSource(canvas, { codec: "avc", quality: mb.QUALITY_HIGH });
  const audio = new mb.AudioBufferSource({ codec: "aac", quality: mb.QUALITY_HIGH });
  output.addVideoTrack(video, { frameRate: CLIP_FPS });
  output.addAudioTrack(audio);
  await output.start();

  const frames = (CLIP_FPS * CLIP_MS) / 1000;
  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, design, frameStateAt(startMs + (i * 1000) / CLIP_FPS, true));
    await video.add(i / CLIP_FPS, 1 / CLIP_FPS);
    if (i % 10 === 0) onProgress(i / frames);
  }
  await audio.add(await renderClipAudio(startMs));
  await output.finalize();

  const day = dayNumber(secondsLeftAt(startMs + CLIP_MS));
  return new File([output.target.buffer!], `countdown-day-${day}.mp4`, { type: "video/mp4" });
}

function saveFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const isPhone = () => window.matchMedia("(pointer: coarse)").matches;

// On phones the share sheet lets the file go straight to Photos or Instagram.
function shareOrSave(file: File) {
  if (isPhone() && navigator.canShare?.({ files: [file] })) {
    navigator.share({ files: [file] }).catch((error: Error) => {
      if (error.name !== "AbortError") saveFile(file);
    });
  } else {
    saveFile(file);
  }
}

const PFP_SIZE = 1080;
const PFP_RED = "#FD0603";

// Instagram crops profile pictures to a circle, so the number stays well inside it.
function drawProfilePic(ctx: CanvasRenderingContext2D, text: string) {
  ctx.fillStyle = PFP_RED;
  ctx.fillRect(0, 0, PFP_SIZE, PFP_SIZE);
  if (!text) return;
  const family = minecraft.style.fontFamily;
  ctx.font = `200px ${family}`;
  const width = ctx.measureText(text).width;
  if (width > 700) ctx.font = `${Math.floor((200 * 700) / width)}px ${family}`;
  const m = ctx.measureText(text);
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    text,
    PFP_SIZE / 2 + (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    PFP_SIZE / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  );
}

function canvasToFile(canvas: HTMLCanvasElement, name: string) {
  // Synchronous, so the share sheet still opens inside the tap on iPhone.
  const binary = atob(canvas.toDataURL("image/png").split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: "image/png" });
}

const DESIGNS: { id: Design; label: string }[] = [
  { id: "bag", label: "MONEY BAG" },
  { id: "watch", label: "1 WATCH" },
  { id: "champagne", label: "2 CHAMPAGNE" },
  { id: "bars", label: "3 GOLD BARS" },
  { id: "jet", label: "4 JET" },
  { id: "crown", label: "5 CROWN" },
  { id: "diamond", label: "6 DIAMOND" },
  { id: "car", label: "7 SUPERCAR" },
  { id: "yacht", label: "8 YACHT" },
  { id: "mansion", label: "9 MANSION" },
  { id: "cash", label: "10 CASH" },
  { id: "chest", label: "11 TREASURE" },
  { id: "coin", label: "12 COIN" },
  { id: "piggy", label: "13 PIGGY BANK" },
  { id: "briefcase", label: "14 BRIEFCASE" },
  { id: "safe", label: "15 SAFE" },
  { id: "trophy", label: "16 TROPHY" },
  { id: "tower", label: "17 SKYSCRAPER" },
  { id: "rocket", label: "18 ROCKET" },
  { id: "heli", label: "19 HELICOPTER" },
  { id: "bitcoin", label: "20 BITCOIN" },
  { id: "card", label: "21 GOLD CARD" },
  { id: "chain", label: "22 GOLD CHAIN" },
  { id: "island", label: "23 ISLAND" },
  { id: "stocks", label: "24 STOCKS" },
];

type ExportState =
  | { status: "idle" }
  | { status: "rendering"; progress: number }
  | { status: "ready"; file: File }
  | { status: "error"; message: string };

const buttonBase =
  "flex min-h-14 touch-manipulation select-none items-center justify-center border-4 border-black px-4 text-lg shadow-[5px_5px_0_0_#000] transition-[transform,box-shadow] duration-75 active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-25";
const buttonClass = `${buttonBase} bg-white text-black hover:bg-black hover:text-white`;
const primaryButtonClass = `${buttonBase} bg-black text-white hover:bg-neutral-800`;

const subscribeEverySecond = (callback: () => void) => {
  const timer = window.setInterval(callback, 1000);
  return () => window.clearInterval(timer);
};

export function ThousandDayCountdown() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const startedAt = useSyncExternalStore(startedAtStore.subscribe, startedAtStore.read, () => null);
  const design = useSyncExternalStore(designStore.subscribe, designStore.read, (): Design => "watch");
  const liveDay = useSyncExternalStore(
    subscribeEverySecond,
    () => dayNumber(startedAt === null ? TOTAL_SECONDS : secondsLeftAt(Date.now() - startedAt)),
    () => dayNumber(TOTAL_SECONDS),
  );
  const [fontReady, setFontReady] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  // null means the profile picture follows the live countdown.
  const [pfpText, setPfpText] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pfpRef = useRef<HTMLCanvasElement>(null);
  const liveTextRef = useRef<HTMLParagraphElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const soundOnRef = useRef(soundOn);
  const pfpNumber = pfpText ?? String(liveDay);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    let cancelled = false;
    void document.fonts.load(`100px ${minecraft.style.fontFamily}`).then(() => {
      if (!cancelled) setFontReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Browsers only allow audio after a click or key press, so every gesture unlocks it.
  const unlockAudio = useCallback(() => {
    audioRef.current ??= new AudioContext();
    void audioRef.current.resume();
    unlockedRef.current = true;
    setAudioUnlocked(true);
  }, []);

  useEffect(() => {
    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [unlockAudio]);

  const play = useCallback((name: SoundName) => {
    const ctx = audioRef.current;
    if (!ctx || !soundOnRef.current) return;
    if (ctx.state === "running") playKnocks(ctx, SOUNDS[name]);
    else if (unlockedRef.current) void ctx.resume().then(() => playKnocks(ctx, SOUNDS[name]));
  }, []);

  // Redraw on every animation frame while running; tick when the second changes.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !fontReady) return;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastSeconds: number | null = null;
    let frame = 0;
    const loop = () => {
      const elapsed = startedAt === null ? 0 : Date.now() - startedAt;
      const seconds = secondsLeftAt(elapsed);
      drawFrame(ctx, design, frameStateAt(elapsed, animate));
      if (seconds !== lastSeconds) {
        if (lastSeconds !== null && seconds < lastSeconds) play(soundFor(seconds));
        if (liveTextRef.current) {
          liveTextRef.current.textContent = `Day ${dayNumber(seconds)}, ${hmsText(seconds)} left today`;
        }
      }
      lastSeconds = seconds;
      if (startedAt !== null && seconds > 0) frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [startedAt, fontReady, play, design]);

  useEffect(() => {
    const ctx = pfpRef.current?.getContext("2d");
    if (ctx && fontReady) drawProfilePic(ctx, pfpNumber);
  }, [pfpNumber, fontReady]);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => setConfirmReset(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirmReset]);

  const handleStart = () => {
    unlockAudio();
    startedAtStore.write(Date.now());
    play("start");
  };

  // Two taps to reset, so a 1000-day run can't be wiped by a stray click.
  const handleReset = () => {
    unlockAudio();
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    startedAtStore.write(null);
    play("reset");
  };

  const handleDownload = async () => {
    // A finished clip whose tap has expired waits for a fresh tap to open the share sheet.
    if (exportState.status === "ready") {
      setExportState({ status: "idle" });
      shareOrSave(exportState.file);
      return;
    }

    const elapsed = startedAt === null ? 0 : Date.now() - startedAt;
    setExportState({ status: "rendering", progress: 0 });
    try {
      const file = await renderClip(design, clipStartMs(elapsed), (progress) =>
        setExportState({ status: "rendering", progress }),
      );
      const canShareNow = !isPhone() || navigator.userActivation?.isActive !== false;
      if (isPhone() && navigator.canShare?.({ files: [file] }) && !canShareNow) {
        setExportState({ status: "ready", file });
      } else {
        shareOrSave(file);
        setExportState({ status: "idle" });
      }
    } catch (error) {
      console.error(error);
      setExportState({
        status: "error",
        message: error instanceof Error && error.message ? error.message : "Couldn't make the video.",
      });
    }
  };

  const handlePfpDownload = () => {
    if (pfpRef.current && pfpNumber) shareOrSave(canvasToFile(pfpRef.current, `profile-pic-${pfpNumber}.png`));
  };

  const nudgePfp = (step: number) => setPfpText(String(Math.max(0, (parseInt(pfpNumber, 10) || 0) + step)));

  const running = startedAt !== null;
  const downloadLabel =
    exportState.status === "rendering"
      ? `MAKING VIDEO ${Math.round(exportState.progress * 100)}%`
      : exportState.status === "ready"
        ? "TAP TO SAVE VIDEO"
        : "DOWNLOAD VIDEO";

  return (
    <div
      className={`${minecraft.className} flex w-full flex-col items-center gap-14 px-4 pb-[max(24px,env(safe-area-inset-bottom))] lg:flex-row lg:items-start lg:justify-center`}
    >
      <h1 className="sr-only">1000 Day Countdown</h1>

      <section className="flex w-[min(calc(100vw-32px),420px,calc(70svh*9/16))] flex-col gap-4">
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          role="img"
          aria-label="1000 day countdown"
          className="aspect-[9/16] w-full border border-neutral-200 bg-white"
        />
        <p ref={liveTextRef} className="sr-only" role="timer" />

        <div className="grid grid-cols-2 gap-3 pr-[5px]">
          <button type="button" className={buttonClass} onClick={handleStart} disabled={!hydrated || running}>
            START
          </button>
          <button type="button" className={buttonClass} onClick={handleReset} disabled={!hydrated || !running}>
            {confirmReset ? "SURE?" : "RESET"}
          </button>
          <button
            type="button"
            className={`${primaryButtonClass} col-span-2`}
            onClick={handleDownload}
            disabled={!fontReady || exportState.status === "rendering"}
          >
            {downloadLabel}
          </button>
        </div>

        {exportState.status === "error" && <p className="text-center text-sm text-neutral-600">{exportState.message}</p>}

        <div>
          <p className="mb-2 text-xs tracking-[0.2em] text-neutral-500">STYLE</p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {DESIGNS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={design === id}
                className={`shrink-0 touch-manipulation border-2 border-black px-3 py-2 text-sm ${
                  design === id ? "bg-black text-white" : "bg-white text-black"
                }`}
                onClick={() => designStore.write(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="self-center py-2 text-sm tracking-[0.2em] text-neutral-500 hover:text-black"
          onClick={() => setSoundOn((on) => !on)}
        >
          {!soundOn ? "SOUND: OFF" : running && !audioUnlocked ? "TAP FOR SOUND" : "SOUND: ON"}
        </button>
      </section>

      <section className="flex w-[min(calc(100vw-32px),420px)] flex-col gap-4 lg:w-[340px]">
        <h2 className="text-xl tracking-[0.2em]">PROFILE PIC</h2>
        <canvas
          ref={pfpRef}
          width={PFP_SIZE}
          height={PFP_SIZE}
          role="img"
          aria-label={`Profile picture showing ${pfpNumber}`}
          className="aspect-square w-full"
          style={{ background: PFP_RED }}
        />
        <div className="grid grid-cols-[auto_1fr_auto] gap-3 pr-[5px]">
          <button type="button" className={`${buttonClass} w-14 px-0`} onClick={() => nudgePfp(-1)} aria-label="One less">
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label="Day number on the profile picture"
            className="min-h-14 w-full border-4 border-black text-center text-2xl outline-none focus:bg-neutral-100"
            value={pfpNumber}
            onChange={(event) => setPfpText(event.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          <button type="button" className={`${buttonClass} w-14 px-0`} onClick={() => nudgePfp(1)} aria-label="One more">
            +
          </button>
        </div>
        <p className="text-center text-xs tracking-[0.15em] text-neutral-500">
          {pfpText === null ? (
            "MATCHES THE COUNTDOWN"
          ) : (
            <button type="button" className="py-1 underline underline-offset-4" onClick={() => setPfpText(null)}>
              MATCH THE COUNTDOWN ({liveDay})
            </button>
          )}
        </p>
        <button
          type="button"
          className={`${primaryButtonClass} mr-[5px]`}
          onClick={handlePfpDownload}
          disabled={!fontReady || !pfpNumber}
        >
          DOWNLOAD PROFILE PIC
        </button>
      </section>
    </div>
  );
}
