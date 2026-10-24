"use client";

import localFont from "next/font/local";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BigCountdown } from "@/components/big-countdown";

const minecraft = localFont({
  src: "../fonts/Minecraft.ttf",
  display: "block",
});

const TOTAL_SECONDS = 1000 * 86_400;
const STORAGE_KEY = "mohossy-count-started-at";
// The real run started on Fri 23 Oct 2026 at 7:36:15 PM Los Angeles time. It's fixed here so every
// phone and laptop counts from the same moment; set it to null to bring back the START button.
const LAUNCHED_AT: number | null = Date.UTC(2026, 9, 24, 2, 36, 15);

// "OCT 23, 2026" / "7:36 PM PDT" in Los Angeles time, the same on the server and every phone.
const laDate = (ms: number) =>
  new Date(ms)
    .toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
const laTime = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

// The page and the downloaded clip are drawn by the same code at Reels size (9:16).
const FRAME_W = 1080;
const FRAME_H = 1920;
const CLIP_FPS = 30;

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

const subscribeNoop = () => () => {};

// The count is a pure function of time since START, so any moment can be redrawn exactly.
function secondsLeftAt(elapsedMs: number) {
  return Math.max(0, TOTAL_SECONDS - Math.floor(Math.max(0, elapsedMs) / 1000));
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function dayNumber(seconds: number) {
  return Math.ceil(seconds / 86_400);
}

// The exact time left, DDD:HH:MM:SS (996:17:48:09 on Day 997, which still has 17h 48m to go).
function timerText(seconds: number) {
  return `${String(Math.floor(seconds / 86_400)).padStart(3, "0")}:${hmsText(seconds)}`;
}

function hmsText(seconds: number) {
  return `${pad2(Math.floor((seconds % 86_400) / 3600))}:${pad2(Math.floor((seconds % 3600) / 60))}:${pad2(seconds % 60)}`;
}

// Sounds are synthesized with Web Audio, so there is no sound file to load. Each one is a
// few bursts of filtered noise (the click) and short sine tones (the body or ring).
type Noise = { filter: BiquadFilterType; freq: number; q?: number; gain: number; decay: number; at?: number };
type Tone = { freq: number; to?: number; gain: number; decay: number; at?: number };
type Voice = { noise?: Noise[]; tones?: Tone[] };

const combine = (...voices: Voice[]): Voice => ({
  noise: voices.flatMap((v) => v.noise ?? []),
  tones: voices.flatMap((v) => v.tones ?? []),
});

// A soft wooden knock, for START, RESET and the clip intro.
function knock(pitch: number, { at = 0, gain = 1, decay = 0.06 } = {}): Voice {
  return {
    noise: [{ filter: "bandpass", freq: pitch * 4, q: 0.9, gain: 0.25 * gain, decay: 0.015, at }],
    tones: [{ freq: pitch, to: pitch * 0.6, gain: 0.2 * gain, decay, at }],
  };
}

// The crisp luxury-watch tick for every second: a tiny high click with a faint metallic ping.
function watchTick(detune = 1, gain = 1): Voice {
  return {
    noise: [
      { filter: "bandpass", freq: 5200 * detune, q: 2.5, gain: 0.57 * gain, decay: 0.008 },
      { filter: "highpass", freq: 7000 * detune, gain: 0.15 * gain, decay: 0.004 },
    ],
    tones: [{ freq: 3400 * detune, gain: 0.063 * gain, decay: 0.025 }],
  };
}

// A crisp drop of liquid: a short sine that chirps upward, with a tiny click on top.
function drop(at: number, freq: number, gain: number, decay: number, rise = 2.4): Voice {
  return {
    tones: [{ freq, to: freq * rise, gain, decay, at }],
    noise: [{ filter: "highpass", freq: 4000, gain: gain * 0.25, decay: 0.003, at }],
  };
}

// The gold draining: a soft trickle of tiny drops while the level falls (thinning out as it
// slows), then a few last drips once it has settled.
function pour(from: number, to: number): Voice {
  const parts: Voice[] = [];
  for (let t = from; t < to; t += (0.03 + Math.random() * 0.03) * (1 + 0.8 * ((t - from) / (to - from)))) {
    parts.push(drop(t, 900 + Math.random() * 1000, 0.0315, 0.03, 1.8));
  }
  parts.push(drop(to + 0.1, 760, 0.098, 0.08), drop(to + 0.26, 690, 0.084, 0.08), drop(to + 0.44, 820, 0.063, 0.08));
  return combine(...parts);
}

const SOUNDS = {
  tick: watchTick(),
  tock: watchTick(0.88),
  minute: watchTick(0.8, 1.25),
  ratchet: {
    noise: [{ filter: "bandpass", freq: 2600, q: 2, gain: 0.3, decay: 0.006 }],
    tones: [{ freq: 1900, gain: 0.03, decay: 0.012 }],
  },
  type: knock(1500, { gain: 0.3, decay: 0.03 }),
  start: combine(knock(820), knock(600, { at: 0.08 })),
  reset: combine(knock(600), knock(820, { at: 0.08 })),
  done: combine(knock(820), knock(720, { at: 0.18 }), knock(610, { at: 0.36 }), knock(480, { at: 0.54, decay: 0.4 })),
} satisfies Record<string, Voice>;

type SoundName = keyof typeof SOUNDS;

function soundFor(secondsLeft: number): SoundName {
  if (secondsLeft === 0) return "done";
  if (secondsLeft % 60 === 0) return "minute";
  return secondsLeft % 2 ? "tick" : "tock";
}

let noiseBuffer: AudioBuffer | null = null;

// The same noise every time (seeded), so a click is exactly as loud on every page load.
function getNoise(ctx: BaseAudioContext) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let seed = 20260512;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 16807) % 2147483647;
      data[i] = (seed / 2147483647) * 2 - 1;
    }
  }
  return noiseBuffer;
}

function playVoice(ctx: BaseAudioContext, voice: Voice, startAt = ctx.currentTime, out: AudioNode = ctx.destination) {
  // A little random wobble so it sounds like a real object, not a machine.
  const wobble = 0.97 + Math.random() * 0.06;
  const level = 0.88 + Math.random() * 0.24;
  for (const n of voice.noise ?? []) {
    const t = startAt + (n.at ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = getNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = n.filter;
    filter.frequency.value = n.freq * wobble;
    filter.Q.value = n.q ?? 0.9;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(n.gain * level, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + n.decay);
    src.connect(filter).connect(amp).connect(out);
    src.start(t);
    src.stop(t + n.decay + 0.02);
  }
  for (const tone of voice.tones ?? []) {
    const t = startAt + (tone.at ?? 0);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(tone.freq * wobble, t);
    if (tone.to) osc.frequency.exponentialRampToValueAtTime(tone.to * wobble, t + tone.decay);
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(tone.gain * level, t + 0.003);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + tone.decay);
    osc.connect(amp).connect(out);
    osc.start(t);
    osc.stop(t + tone.decay + 0.02);
  }
}

// Frame layout in 1080x1920 pixels, kept clear of the Reels caption and button overlays.
const LAYOUT = {
  days: { size: 96, y: 250, spacing: 6 },
  about: { size: 50, y: 340, spacing: 6 },
  hook: { size: 30, y: 400, spacing: 4 },
  timer: { size: 92, y: 1530 },
  timerLabel: { size: 26, y: 1578, spacing: 4 },
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

type Point = [number, number];

type OverlayContext = {
  fillCell: (c: number, r: number, color: string) => void;
  seconds: number;
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

type PreparedArt = Art & {
  isBody: (c: number, r: number) => boolean;
  isEdge: (c: number, r: number) => boolean;
  fillRows: number[];
  fillTotal: number;
  // For each column, the rows whose cells hold gold.
  fillCols: number[][];
  // Top and bottom (in frame pixels) of the area that can hold gold.
  fillTop: number;
  fillBottom: number;
};

function prepare(art: Art): PreparedArt {
  const { cols, rows, body, ink } = art;
  const isBody = (c: number, r: number) => c >= 0 && r >= 0 && c < cols && r < rows && body[r * cols + c] === 1;
  const isEdge = (c: number, r: number) =>
    isBody(c, r) && (!isBody(c - 1, r) || !isBody(c + 1, r) || !isBody(c, r - 1) || !isBody(c, r + 1));
  // A cell holds gold if it is inside the shape and not part of an outline or detail line.
  const fillRows = Array.from({ length: rows }, (_, r) => {
    let count = 0;
    for (let c = 0; c < cols; c++) if (isBody(c, r) && !isEdge(c, r) && !ink[r * cols + c]) count++;
    return count;
  });
  const fillCols = Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (_, r) => r).filter((r) => isBody(c, r) && !isEdge(c, r) && !ink[r * cols + c]),
  );
  const firstRow = fillRows.findIndex((n) => n > 0);
  const lastRow = fillRows.length - 1 - [...fillRows].reverse().findIndex((n) => n > 0);
  return {
    ...art,
    isBody,
    isEdge,
    fillRows,
    fillTotal: fillRows.reduce((sum, n) => sum + n, 0),
    fillCols,
    fillTop: art.top + firstRow * art.cell,
    fillBottom: art.top + (lastRow + 1) * art.cell,
  };
}

let watchArt: PreparedArt | undefined;

function getArt() {
  watchArt ??= prepare(buildWatch());
  return watchArt;
}

// Where the gold surface sits so that the gold covers exactly `fraction` of the fillable area.
// Measuring area, not height, keeps it honest for shapes that are wider in some places
// (the watch case vs its band, the top of the flute vs its narrow bottom).
function goldLevel(art: PreparedArt, fraction: number) {
  const { rows, cell, top, fillRows, fillTotal } = art;
  let remaining = Math.min(1, Math.max(0, fraction)) * fillTotal;
  let firstRow = rows;
  for (let r = rows - 1; r >= 0; r--) {
    const n = fillRows[r];
    if (!n) continue;
    firstRow = r;
    if (remaining <= n) return top + (r + 1 - remaining / n) * cell;
    remaining -= n;
  }
  return top + firstRow * cell;
}

// Surface height for each column, wave included, such that the gold covers exactly `fraction`
// of the fillable area. The gold's area only shrinks as the surface moves down, so a quick
// bisection pins it to well under a millionth of a cell, every frame.
function solveSurfaces(art: PreparedArt, fraction: number, offsets: number[]) {
  const { cell, top, fillCols, fillTotal } = art;
  const target = clamp01(fraction) * fillTotal;
  const area = (base: number) => {
    let sum = 0;
    fillCols.forEach((rowsInCol, c) => {
      const surface = base + offsets[c];
      for (const r of rowsInCol) sum += clamp01((top + (r + 1) * cell - surface) / cell);
    });
    return sum;
  };
  let lo = art.fillTop - cell * 2;
  let hi = art.fillBottom + cell * 2;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (area(mid) > target) lo = mid;
    else hi = mid;
  }
  const base = (lo + hi) / 2;
  return offsets.map((o) => base + o);
}

function drawArt(ctx: CanvasRenderingContext2D, art: PreparedArt, fraction: number, seconds: number, waveMs: number) {
  const { cols, rows, cell, left, top, ink, isBody, isEdge } = art;
  const level = goldLevel(art, fraction);
  // A gentle wave on the surface. Near full or empty it shrinks so it never runs past the top
  // or bottom of the shape.
  const amplitude = Math.max(0, Math.min(cell * 0.45, (level - art.fillTop) / 2, (art.fillBottom - level) / 2));
  const offsets = Array.from(
    { length: cols },
    (_, c) => amplitude * Math.sin(((left + c * cell) / 260) * Math.PI * 2 + (waveMs / 1600) * Math.PI * 2),
  );
  const surfaces = solveSurfaces(art, fraction, offsets);
  // Each colour is collected into one path and filled once, so neighbouring cells never show
  // hairline seams, even when the clip zooms in.
  const gold = new Path2D();
  const shine = new Path2D();
  const inkPath = new Path2D();
  const bleed = 0.5;
  const under = (cc: number, rr: number) => ink[rr * cols + cc] === 1 || isEdge(cc, rr);
  for (let c = 0; c < cols; c++) {
    const x = left + c * cell;
    const surface = surfaces[c];
    // The light band just under the surface, then plain gold below it. They sit side by side
    // (the band reaches 1 px under the gold so their shared edge has no gap), never stacked, so
    // the soft top edge shows exactly as much gold as is really there.
    const shineEnd = surface + cell * 0.5;
    for (let r = 0; r < rows; r++) {
      const y = top + r * cell;
      if (ink[r * cols + c] || isEdge(c, r)) {
        inkPath.rect(x, y, cell, cell);
        continue;
      }
      if (!isBody(c, r) || y + cell <= surface) continue;
      const from = Math.max(y, surface);
      const bottom = y + cell;
      // Bleed only under an outline, so it hides the seam without adding any visible gold.
      const bl = under(c - 1, r) ? bleed : 0;
      const br = under(c + 1, r) ? bleed : 0;
      const bb = under(c, r + 1) ? bleed : 0;
      if (from < shineEnd) {
        const end = Math.min(bottom, shineEnd + 1);
        shine.rect(x - bl, from, cell + bl + br, end - from + (end === bottom ? bb : 0));
      }
      const goldFrom = Math.max(from, shineEnd);
      if (goldFrom < bottom) gold.rect(x - bl, goldFrom, cell + bl + br, bottom - goldFrom + bb);
    }
  }
  ctx.fillStyle = GOLD_LIGHT;
  ctx.fill(shine);
  ctx.fillStyle = GOLD;
  ctx.fill(gold);
  ctx.fillStyle = INK;
  ctx.fill(inkPath);

  const overlayPaths = new Map<string, Path2D>();
  const fillCell = (c: number, r: number, color: string) => {
    if (!overlayPaths.has(color)) overlayPaths.set(color, new Path2D());
    overlayPaths.get(color)!.rect(left + c * cell, top + r * cell, cell, cell);
  };
  art.overlay?.({ fillCell, seconds });
  for (const [color, path] of overlayPaths) {
    ctx.fillStyle = color;
    ctx.fill(path);
  }
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

type FrameState = {
  seconds: number;
  before: number;
  sinceMs: number | null;
  waveMs: number;
  // Share of the 1000 days still left (1 = full gold) and the day shown in the headline.
  fraction: number;
  day: number;
  // Seconds into a downloaded clip; drives the opening animation. Unset on the live page.
  introS?: number;
  // Close-up camera for the clip opening: frame point (cx, cy) shown at the centre, `zoom` times.
  camera?: { zoom: number; cx: number; cy: number };
};

function frameStateAt(elapsedMs: number, animate: boolean): FrameState {
  const tick = Math.floor(Math.max(0, elapsedMs) / 1000);
  const seconds = secondsLeftAt(elapsedMs);
  const before = tick > 0 ? secondsLeftAt(tick * 1000 - 1) : seconds;
  return {
    seconds,
    before,
    sinceMs: animate && before !== seconds ? elapsedMs - tick * 1000 : null,
    waveMs: elapsedMs,
    fraction: seconds / TOTAL_SECONDS,
    day: dayNumber(seconds),
  };
}

const ABOUT = "TO BECOME A BILLIONAIRE";
const HOOK = "OR SOMETHING HUGE WILL HAPPEN";
const TALK = "EVERYONE WILL BE TALKING ABOUT IT";

// Opening sequence of a downloaded clip, in seconds, and which parts of it play.
const INTRO = {
  clipSeconds: 10,
  zoom: true,
  // The day number spins and locks in (false: it just appears with the headline).
  spin: true,
  // How lines 2-4 appear: typed out letter by letter, or a quick fade.
  lines: "typed" as "typed" | "fade",
  // Swipe "or something huge will happen" away for "everyone will be talking about it".
  talk: true,
  sounds: { ratchet: true, typing: true, pour: true },
  // When the close-up has fully pulled back; null = just after the number lands.
  zoomOutEnd: null as number | null,
  headlineIn: 0.15,
  spinStart: 0.15,
  firstStop: 1.55,
  stopGap: 0.25,
  drainStart: 0.3,
  drainEnd: 1.3,
  typeGap: 0.55,
  typeStep: 0.04,
  hookGap: 0.2,
  hookHold: 0.7,
  swipe: 0.32,
  talkGap: 0.05,
  fade: 0.35,
};

const clipMs = () => INTRO.clipSeconds * 1000;

function introTimes(digits: number) {
  const lineTime = (text: string) => (INTRO.lines === "typed" ? text.length * INTRO.typeStep : INTRO.fade);
  const landed = INTRO.spin ? INTRO.firstStop + (digits - 1) * INTRO.stopGap : INTRO.headlineIn + INTRO.fade;
  const typeStart = landed + INTRO.typeGap;
  const typeEnd = typeStart + lineTime(ABOUT);
  const hookStart = typeEnd + INTRO.hookGap;
  const hookEnd = hookStart + lineTime(HOOK);
  const swipeStart = hookEnd + INTRO.hookHold;
  const talkStart = swipeStart + INTRO.swipe + INTRO.talkGap;
  const talkEnd = INTRO.talk ? talkStart + lineTime(TALK) : hookEnd;
  return { landed, typeStart, typeEnd, hookStart, swipeStart, talkStart, talkEnd };
}

// How many letters of `text` have been typed by clip time `t` if typing starts at `start`.
function typedCount(text: string, start: number, t: number) {
  return Math.floor(clamp01((t - start) / (text.length * INTRO.typeStep)) * text.length);
}

// How far reel `i` still has to roll (in digits) at clip time `t`; 0 once it has landed.
function reelOffset(i: number, t: number) {
  const stop = INTRO.firstStop + i * INTRO.stopGap;
  const u = clamp01((t - INTRO.spinStart) / (stop - INTRO.spinStart));
  return (2 + i) * 10 * (1 - backOut(u));
}

const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

// One reel per digit; each spins down a few times and clunks onto its digit, left to right.
function drawSlotNumber(ctx: CanvasRenderingContext2D, number: string, x: number, baseline: number, spacing: number, t: number) {
  const size = parseFloat(ctx.font);
  const ascent = ctx.measureText("0").actualBoundingBoxAscent;
  const pad = size * 0.08;
  const height = ascent + pad * 2;
  ctx.textAlign = "center";
  [...number].forEach((char, i) => {
    const w = ctx.measureText(char).width;
    const reel = Number(char) + reelOffset(i, t);
    const k = Math.floor(reel);
    const f = reel - k;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, baseline - ascent - pad, w, height);
    ctx.clip();
    ctx.fillText(String(((k % 10) + 10) % 10), x + w / 2, baseline - f * height);
    ctx.fillText(String((((k + 1) % 10) + 10) % 10), x + w / 2, baseline + (1 - f) * height);
    ctx.restore();
    x += w + spacing;
  });
  ctx.textAlign = "left";
}

// Types `text` up to `typed` letters, each already in its final centered position.
function drawTyped(ctx: CanvasRenderingContext2D, text: string, typed: number, { y, spacing }: { y: number; spacing: number }) {
  if (typed <= 0) return;
  const start = FRAME_W / 2 - spacedWidth(ctx, text, spacing) / 2;
  drawSpacedFrom(ctx, text.slice(0, typed), start, y, spacing);
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  start: number,
  t: number | null,
  pos: { y: number; spacing: number },
) {
  if (t === null) return drawTyped(ctx, text, text.length, pos);
  if (INTRO.lines === "typed") return drawTyped(ctx, text, typedCount(text, start, t), pos);
  const shown = clamp01((t - start) / INTRO.fade);
  if (shown <= 0) return;
  ctx.save();
  ctx.globalAlpha *= shown;
  ctx.translate(0, (1 - easeOut(shown)) * 16);
  drawTyped(ctx, text, text.length, pos);
  ctx.restore();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  { seconds, before, sinceMs, waveMs, fraction, day, introS, camera }: FrameState,
) {
  const family = minecraft.style.fontFamily;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  ctx.textBaseline = "alphabetic";
  // Everything is drawn through the camera, so a close-up stays sharp rather than blown up.
  if (camera) {
    ctx.setTransform(camera.zoom, 0, 0, camera.zoom, FRAME_W / 2 - camera.zoom * camera.cx, FRAME_H / 2 - camera.zoom * camera.cy);
  }

  const { days, about, hook, timer, timerLabel } = LAYOUT;
  const number = String(day);
  const rest = day === 1 ? " DAY LEFT" : " DAYS LEFT";
  const times = introS === undefined ? null : introTimes(number.length);

  // Line 1 slides up into place, its number spinning until it lands.
  const headlineIn = times ? clamp01((introS! - INTRO.headlineIn) / INTRO.fade) : 1;
  if (headlineIn > 0) {
    ctx.font = `${days.size}px ${family}`;
    const numberW = spacedWidth(ctx, number, days.spacing) + days.spacing;
    const x = (FRAME_W - numberW - spacedWidth(ctx, rest, days.spacing)) / 2;
    ctx.save();
    ctx.globalAlpha = headlineIn;
    ctx.translate(0, (1 - easeOut(headlineIn)) * 40);
    ctx.fillStyle = AMBER;
    if (times && INTRO.spin && introS! < times.landed + 0.5) drawSlotNumber(ctx, number, x, days.y, days.spacing, introS!);
    else drawSpacedFrom(ctx, number, x, days.y, days.spacing);
    ctx.fillStyle = INK;
    drawSpacedFrom(ctx, rest, x + numberW, days.y, days.spacing);
    ctx.restore();
  }

  // Line 2 appears in its final position.
  ctx.font = `${about.size}px ${family}`;
  ctx.fillStyle = INK;
  const t = times ? introS! : null;
  drawLine(ctx, ABOUT, times?.typeStart ?? 0, t, about);

  // Line 3 appears, then (with `talk`) swipes off to the left and line 4 appears in its place.
  ctx.font = `${hook.size}px ${family}`;
  ctx.fillStyle = "#6b6b6b";
  if (!INTRO.talk) {
    drawLine(ctx, HOOK, times?.hookStart ?? 0, t, hook);
  } else if (!times || t === null) {
    drawTyped(ctx, TALK, TALK.length, hook);
  } else {
    if (t < times.swipeStart + INTRO.swipe) {
      const swipe = clamp01((t - times.swipeStart) / INTRO.swipe);
      ctx.save();
      ctx.globalAlpha = 1 - swipe;
      ctx.translate(-FRAME_W * swipe ** 3, 0);
      drawLine(ctx, HOOK, times.hookStart, t, hook);
      ctx.restore();
    }
    drawLine(ctx, TALK, times.talkStart, t, hook);
  }

  drawArt(ctx, getArt(), fraction, seconds, waveMs);

  ctx.fillStyle = INK;
  ctx.font = `${timer.size}px ${family}`;
  const slots = drawRollingRow(ctx, timerText(seconds), timerText(before), sinceMs, timer.y);
  // Small labels under each group, counted from the right since the days group can change width.
  ctx.font = `${timerLabel.size}px ${family}`;
  const n = slots.length;
  const groups: [string, number, number][] = [["DAYS", 0, n - 10], ["HRS", n - 8, n - 7], ["MIN", n - 5, n - 4], ["SEC", n - 2, n - 1]];
  for (const [label, first, last] of groups) {
    const cx = (slots[first].x + slots[last].x + slots[last].w) / 2;
    drawSpacedFrom(ctx, label, cx - spacedWidth(ctx, label, timerLabel.spacing) / 2, timerLabel.y, timerLabel.spacing);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// The clip opens full of gold and drains to the countdown's true level, landing together
// with the spinning day number; from then on every frame shows the real value.
// How close the opening shot gets: close enough that today's drop covers ~240 px on screen.
// Early on the gold only falls a few pixels, so the camera goes in tighter (up to 24x);
// once the drop is big it stays at 3x so the whole pour is in view.
const DROP_ON_SCREEN = 240;
const MIN_CLOSE_UP = 3;
const MAX_CLOSE_UP = 24;

function withIntro(state: FrameState, clipSeconds: number): FrameState {
  const art = getArt();
  const { landed } = introTimes(String(state.day).length);
  // The gold drains first, while the camera is in close, and holds a beat at its new level.
  const p = easeInOut(clamp01((clipSeconds - INTRO.drainStart) / (INTRO.drainEnd - INTRO.drainStart)));
  const fraction = 1 + (state.fraction - 1) * p;
  const drop = goldLevel(art, state.fraction) - goldLevel(art, 1);
  const closeUp = Math.min(MAX_CLOSE_UP, Math.max(MIN_CLOSE_UP, DROP_ON_SCREEN / Math.max(drop, 0.01)));

  // The shot opens with the surface a quarter of the way down and holds still, so you watch the
  // gold drop. If the drop would run past half the screen, the camera follows part of the way
  // (in step with the gold, so it never jerks) to keep the surface in view. Then it pulls back
  // to the whole frame as the day number locks in. The zoom changes at an even rate (log scale)
  // and the centre slides with the size of the view, so even a 24x pull-back feels smooth.
  const zoomStart = INTRO.drainEnd + 0.15;
  const zoomEnd = INTRO.zoomOutEnd ?? landed + 0.25;
  const out = easeInOut(clamp01((clipSeconds - zoomStart) / (zoomEnd - zoomStart)));
  if (!INTRO.zoom || out >= 1) return { ...state, introS: clipSeconds, fraction };
  const zoom = closeUp ** (1 - out);
  const travel = drop * closeUp;
  const followShare = travel > FRAME_H * 0.5 ? 1 - (FRAME_H * 0.5) / travel : 0;
  const startLevel = goldLevel(art, 1);
  const follow = startLevel + (FRAME_H / closeUp) * 0.25 + followShare * (goldLevel(art, fraction) - startLevel);
  const widen = (1 / zoom - 1 / closeUp) / (1 - 1 / closeUp);
  const camera = { zoom, cx: FRAME_W / 2, cy: follow + (FRAME_H / 2 - follow) * widen };
  return { ...state, introS: clipSeconds, fraction, camera };
}

// "Last 10 seconds": ends just before the latest tick, so the clip has 10 evenly spaced ticks.
function clipStartMs(elapsedMs: number) {
  return Math.max(0, Math.floor(elapsedMs / 1000) * 1000 - 500 - clipMs());
}

// A ratchet click each time the last reel rolls past a digit (at most ~40 a second), so it
// races, slows and settles with the picture. The number lands without an extra sound.
function playRatchet(ctx: BaseAudioContext, out: AudioNode, digits: number, landed: number) {
  let lastClick = -1;
  let lastDigit = Math.floor(reelOffset(digits - 1, INTRO.spinStart));
  for (let t = INTRO.spinStart; t <= landed + 0.3; t += 0.001) {
    const digit = Math.floor(reelOffset(digits - 1, t));
    if (digit !== lastDigit && t - lastClick >= 0.025) {
      playVoice(ctx, SOUNDS.ratchet, t, out);
      lastClick = t;
    }
    lastDigit = digit;
  }
}

async function renderClipAudio(startMs: number) {
  const rate = 48_000;
  const ctx = new OfflineAudioContext(2, (rate * clipMs()) / 1000, rate);
  // Louder than the live page so the ticks carry on a phone speaker.
  const out = ctx.createGain();
  out.gain.value = 1.8;
  out.connect(ctx.destination);
  const digits = String(dayNumber(secondsLeftAt(startMs + 2500))).length;
  const { landed, typeStart, hookStart, talkStart, talkEnd } = introTimes(digits);

  const quietFrom = [0];
  if (INTRO.sounds.ratchet && INTRO.spin) {
    playRatchet(ctx, out, digits, landed);
    quietFrom.push(landed + 0.1);
  }
  // Quieter while little has drained, so a tiny drop in the gold never sounds like a big pour.
  const drained = 1 - secondsLeftAt(startMs + landed * 1000) / TOTAL_SECONDS;
  const liquid = ctx.createGain();
  liquid.gain.value = 0.3 + 0.7 * clamp01(drained / 0.1);
  liquid.connect(out);
  if (INTRO.sounds.pour) {
    playVoice(ctx, pour(INTRO.drainStart, INTRO.drainEnd), 0, liquid);
    quietFrom.push(INTRO.drainEnd + 0.52);
  }
  if (INTRO.sounds.typing && INTRO.lines === "typed") {
    const typed: [string, number][] = [[ABOUT, typeStart], [HOOK, hookStart]];
    if (INTRO.talk) typed.push([TALK, talkStart]);
    for (const [text, start] of typed) {
      [...text].forEach((char, i) => char !== " " && playVoice(ctx, SOUNDS.type, start + i * INTRO.typeStep, out));
    }
    quietFrom.push(talkEnd);
  }

  // The timer keeps counting, but its tick stays quiet until the intro sounds are done.
  const ticksFrom = Math.max(...quietFrom) + 0.1;
  for (let t = Math.max(1000, Math.ceil(startMs / 1000) * 1000); t < startMs + clipMs(); t += 1000) {
    const at = (t - startMs) / 1000;
    const left = secondsLeftAt(t);
    if (at >= ticksFrom && left < secondsLeftAt(t - 1)) playVoice(ctx, SOUNDS[soundFor(left)], at, out);
  }
  // Safety net: if anything peaks too close to full scale, turn the whole track down to fit.
  const buffer = await ctx.startRendering();
  let peak = 0;
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    for (const x of buffer.getChannelData(ch)) peak = Math.max(peak, Math.abs(x));
  }
  if (peak > 0.7) {
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) data[i] *= 0.7 / peak;
    }
  }
  return buffer;
}

let aacFallbackRegistered = false;

async function renderClip(startMs: number, onProgress: (fraction: number) => void) {
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

  const frames = (CLIP_FPS * clipMs()) / 1000;
  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, withIntro(frameStateAt(startMs + (i * 1000) / CLIP_FPS, true), i / CLIP_FPS));
    await video.add(i / CLIP_FPS, 1 / CLIP_FPS);
    if (i % 10 === 0) onProgress(i / frames);
  }
  await audio.add(await renderClipAudio(startMs));
  await output.finalize();

  const day = dayNumber(secondsLeftAt(startMs + clipMs()));
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

// Instagram crops profile pictures to a circle, so the number stays well inside it. White on red.
function drawProfilePic(ctx: CanvasRenderingContext2D, text: string) {
  ctx.fillStyle = PFP_RED;
  ctx.fillRect(0, 0, PFP_SIZE, PFP_SIZE);
  if (!text) return;
  const family = minecraft.style.fontFamily;
  ctx.font = `200px ${family}`;
  const width = ctx.measureText(text).width;
  if (width > 700) ctx.font = `${Math.floor((200 * 700) / width)}px ${family}`;
  const m = ctx.measureText(text);
  ctx.fillStyle = "#fff";
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

type ExportState =
  | { status: "idle" }
  | { status: "rendering"; progress: number }
  | { status: "ready"; file: File }
  | { status: "error"; message: string };

const buttonBase =
  "flex min-h-14 touch-manipulation select-none items-center justify-center border-4 border-black px-4 text-lg shadow-[5px_5px_0_0_#000] transition-[transform,box-shadow] duration-75 active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-25";
const buttonClass = `${buttonBase} bg-white text-black hover:bg-black hover:text-white`;
const primaryButtonClass = `${buttonBase} bg-black text-white hover:bg-neutral-800`;

// Wakes up right on each second boundary of the run, in step with the reel's tick.
function subscribeToSeconds(startedAt: number | null) {
  return (callback: () => void) => {
    if (startedAt === null) return () => {};
    const wait = () => 1000 - ((Date.now() - startedAt) % 1000) + 5;
    let timer = 0;
    const step = () => {
      callback();
      timer = window.setTimeout(step, wait());
    };
    timer = window.setTimeout(step, wait());
    return () => window.clearTimeout(timer);
  };
}

export function ThousandDayCountdown() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const storedStart = useSyncExternalStore(startedAtStore.subscribe, startedAtStore.read, () => null);
  const startedAt = LAUNCHED_AT ?? storedStart;
  const subscribeSeconds = useCallback((callback: () => void) => subscribeToSeconds(startedAt)(callback), [startedAt]);
  const secondsLeft = useSyncExternalStore(
    subscribeSeconds,
    () => (startedAt === null ? TOTAL_SECONDS : secondsLeftAt(Date.now() - startedAt)),
    () => TOTAL_SECONDS,
  );
  const liveDay = dayNumber(secondsLeft);

  const [fontReady, setFontReady] = useState(false);
  // Off until tapped: phones only allow sound after a tap anyway, so the button always tells the truth.
  const [soundOn, setSoundOn] = useState(false);
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
  }, []);

  const toggleSound = () => {
    if (!soundOn) unlockAudio();
    setSoundOn((on) => !on);
  };

  const play = useCallback((name: SoundName) => {
    const ctx = audioRef.current;
    if (!ctx || !soundOnRef.current) return;
    if (ctx.state === "running") playVoice(ctx, SOUNDS[name]);
    else if (unlockedRef.current) void ctx.resume().then(() => playVoice(ctx, SOUNDS[name]));
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
      drawFrame(ctx, frameStateAt(elapsed, animate));
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
  }, [startedAt, fontReady, play]);

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
      const file = await renderClip(clipStartMs(elapsed), (progress) =>
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
      className={`${minecraft.className} flex w-full flex-col items-center gap-14 px-4 pb-[max(24px,env(safe-area-inset-bottom))]`}
    >
      <h1 className="sr-only">1000 Day Countdown</h1>

      {/* The main countdown. Remounted once on hydration so it doesn't roll from 1000:00:00:00 on load. */}
      <section className={`flex w-full flex-col items-center gap-4 ${hydrated ? "" : "invisible"}`}>
        <BigCountdown key={hydrated ? "live" : "static"} seconds={secondsLeft} className="text-[min(10.5vw,112px)]" />
        {LAUNCHED_AT !== null && (
          <div className="flex flex-col items-center gap-1 text-center text-sm tracking-[0.2em] text-neutral-500">
            <p>STARTED {laDate(LAUNCHED_AT)}</p>
            <p className="text-black">
              ENDS {laDate(LAUNCHED_AT + TOTAL_SECONDS * 1000)}{" "}
              <span className="whitespace-nowrap">AT {laTime(LAUNCHED_AT + TOTAL_SECONDS * 1000)}</span>
            </p>
          </div>
        )}
        <button
          type="button"
          aria-pressed={soundOn}
          onClick={toggleSound}
          className={`${soundOn ? primaryButtonClass : buttonClass} mt-2 min-w-52`}
        >
          {soundOn ? "SOUND: ON" : "SOUND: OFF"}
        </button>
      </section>

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
          {LAUNCHED_AT === null && (
            <>
              <button type="button" className={buttonClass} onClick={handleStart} disabled={!hydrated || running}>
                START
              </button>
              <button type="button" className={buttonClass} onClick={handleReset} disabled={!hydrated || !running}>
                {confirmReset ? "SURE?" : "RESET"}
              </button>
            </>
          )}
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

      </section>

      <section className="flex w-[min(calc(100vw-32px),420px)] flex-col gap-4">
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
