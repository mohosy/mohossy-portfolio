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
      { filter: "bandpass", freq: 5200 * detune, q: 2.5, gain: 0.95 * gain, decay: 0.008 },
      { filter: "highpass", freq: 7000 * detune, gain: 0.25 * gain, decay: 0.004 },
    ],
    tones: [{ freq: 3400 * detune, gain: 0.105 * gain, decay: 0.025 }],
  };
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

function getNoise(ctx: BaseAudioContext) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
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
  const firstRow = fillRows.findIndex((n) => n > 0);
  const lastRow = fillRows.length - 1 - [...fillRows].reverse().findIndex((n) => n > 0);
  return {
    ...art,
    isBody,
    isEdge,
    fillRows,
    fillTotal: fillRows.reduce((sum, n) => sum + n, 0),
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

function drawArt(ctx: CanvasRenderingContext2D, art: PreparedArt, fraction: number, seconds: number, waveMs: number) {
  const { cols, rows, cell, left, top, ink, isBody, isEdge } = art;
  const level = goldLevel(art, fraction);
  // The wave's crests and dips cancel out, so it doesn't change how much gold shows. Near
  // full or empty it shrinks so it never runs past the top or bottom, which would break that.
  const amplitude = Math.max(0, Math.min(cell * 0.45, (level - art.fillTop) / 2, (art.fillBottom - level) / 2));
  const offsets = Array.from(
    { length: cols },
    (_, c) => amplitude * Math.sin(((left + c * cell) / 260) * Math.PI * 2 + (waveMs / 1600) * Math.PI * 2),
  );
  // Re-center the wave on the columns that hold gold at this height, so in every frame its
  // crests add exactly as much gold as its dips remove.
  const levelRow = Math.min(rows - 1, Math.max(0, Math.floor((level - top) / cell)));
  const holdsGold = (c: number) => isBody(c, levelRow) && !isEdge(c, levelRow) && !ink[levelRow * cols + c];
  const goldCols = offsets.filter((_, c) => holdsGold(c));
  const shift = goldCols.length ? goldCols.reduce((sum, o) => sum + o, 0) / goldCols.length : 0;
  const surfaces = offsets.map((o) => level + o - shift);
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
      ctx.fillStyle = GOLD;
      ctx.fillRect(x, from, cell, y + cell - from);
      if (surface > y - cell * 0.5) {
        ctx.fillStyle = GOLD_LIGHT;
        ctx.fillRect(x, from, cell, Math.min(cell * 0.5, y + cell - from));
      }
    }
  }
  art.overlay?.({ fillCell, seconds });
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

// Opening sequence of a downloaded clip, in seconds. The day number spins like a slot
// machine while the gold drains; both land on the true value at the same moment, then
// the second line types itself out and the third fades in.
const INTRO = {
  headlineIn: 0.15,
  spinStart: 0.15,
  firstStop: 1.55,
  stopGap: 0.25,
  drainStart: 0.35,
  typeGap: 0.25,
  typeStep: 0.04,
  hookGap: 0.2,
  fade: 0.35,
};

function introTimes(digits: number) {
  const landed = INTRO.firstStop + (digits - 1) * INTRO.stopGap;
  const typeStart = landed + INTRO.typeGap;
  const typeEnd = typeStart + ABOUT.length * INTRO.typeStep;
  const hookStart = typeEnd + INTRO.hookGap;
  return { landed, typeStart, typeEnd, hookStart };
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

const HOOK_WORD_GAP = 0.12;
const HOOK_POP = 0.28;
const HOOK_SLAM = 0.4;

// Each word of the hook pops up from nothing with a little overshoot, one after another.
// HUGE gets its own entrance: it starts big, slams down to size and shakes the line.
function drawHook(ctx: CanvasRenderingContext2D, { y, spacing }: { y: number; spacing: number }, t: number | null) {
  const words = HOOK.split(" ");
  const space = ctx.measureText(" ").width + spacing * 2;
  const widths = words.map((word) => spacedWidth(ctx, word, spacing));
  let x = (FRAME_W - (widths.reduce((sum, w) => sum + w, 0) + space * (words.length - 1))) / 2;
  const capHeight = ctx.measureText("H").actualBoundingBoxAscent;
  const hugeAt = words.indexOf("HUGE") * HOOK_WORD_GAP;
  // A short, fading side-to-side shake once HUGE lands.
  const sinceSlam = t === null ? Infinity : t - hugeAt - HOOK_SLAM * 0.55;
  const shake = sinceSlam >= 0 && sinceSlam < 0.3 ? Math.sin(sinceSlam * 70) * 7 * (1 - sinceSlam / 0.3) : 0;

  words.forEach((word, i) => {
    const w = widths[i];
    const start = i * HOOK_WORD_GAP;
    const huge = word === "HUGE";
    const p = t === null ? 1 : clamp01((t - start) / (huge ? HOOK_SLAM : HOOK_POP));
    if (p > 0) {
      const scale = huge ? 1 + 1.6 * (1 - easeOut(p)) ** 2 - 0.12 * Math.sin(Math.PI * clamp01((p - 0.55) / 0.45)) : backOut(p);
      const cx = x + w / 2;
      const cy = y - capHeight / 2;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p * 3);
      ctx.translate(cx + shake, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);
      drawSpacedFrom(ctx, word, x, y, spacing);
      ctx.restore();
    }
    x += w + space;
  });
}

function drawFrame(ctx: CanvasRenderingContext2D, { seconds, before, sinceMs, waveMs, fraction, day, introS }: FrameState) {
  const family = minecraft.style.fontFamily;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  ctx.textBaseline = "alphabetic";

  const { days, about, hook, hms } = LAYOUT;
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
    if (times && introS! < times.landed + 0.5) drawSlotNumber(ctx, number, x, days.y, days.spacing, introS!);
    else drawSpacedFrom(ctx, number, x, days.y, days.spacing);
    ctx.fillStyle = INK;
    drawSpacedFrom(ctx, rest, x + numberW, days.y, days.spacing);
    ctx.restore();
  }

  // Line 2 types itself out, letter by letter, in its final position.
  ctx.font = `${about.size}px ${family}`;
  ctx.fillStyle = INK;
  const typed = times ? Math.floor(clamp01((introS! - times.typeStart) / (ABOUT.length * INTRO.typeStep)) * ABOUT.length) : ABOUT.length;
  if (typed > 0) {
    const start = FRAME_W / 2 - spacedWidth(ctx, ABOUT, about.spacing) / 2;
    drawSpacedFrom(ctx, ABOUT.slice(0, typed), start, about.y, about.spacing);
  }

  // Line 3 pops in word by word, and HUGE slams down.
  ctx.font = `${hook.size}px ${family}`;
  ctx.fillStyle = "#6b6b6b";
  drawHook(ctx, hook, times ? introS! - times.hookStart : null);

  drawArt(ctx, getArt(), fraction, seconds, waveMs);

  ctx.fillStyle = INK;
  ctx.font = `${hms.size}px ${family}`;
  drawRollingRow(ctx, hmsText(seconds), hmsText(before), sinceMs, hms.y);
}

// The clip opens full of gold and drains to the countdown's true level, landing together
// with the spinning day number; from then on every frame shows the real value.
function withIntro(state: FrameState, clipSeconds: number): FrameState {
  const { landed } = introTimes(String(state.day).length);
  const p = easeInOut(clamp01((clipSeconds - INTRO.drainStart) / (landed - INTRO.drainStart)));
  return { ...state, introS: clipSeconds, fraction: 1 + (state.fraction - 1) * p };
}

// "Last 10 seconds": ends just before the latest tick, so the clip has 10 evenly spaced ticks.
function clipStartMs(elapsedMs: number) {
  return Math.max(0, Math.floor(elapsedMs / 1000) * 1000 - 500 - CLIP_MS);
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
  const ctx = new OfflineAudioContext(2, (rate * CLIP_MS) / 1000, rate);
  // Louder than the live page so the ticks carry on a phone speaker.
  const out = ctx.createGain();
  out.gain.value = 1.8;
  out.connect(ctx.destination);
  const digits = String(dayNumber(secondsLeftAt(startMs + 2500))).length;
  const { landed, typeStart, typeEnd } = introTimes(digits);

  playRatchet(ctx, out, digits, landed);
  [...ABOUT].forEach((char, i) => char !== " " && playVoice(ctx, SOUNDS.type, typeStart + i * INTRO.typeStep, out));

  // The timer keeps counting, but its tick stays quiet until the intro sounds are done.
  const ticksFrom = typeEnd + 0.1;
  for (let t = Math.max(1000, Math.ceil(startMs / 1000) * 1000); t < startMs + CLIP_MS; t += 1000) {
    const at = (t - startMs) / 1000;
    const left = secondsLeftAt(t);
    if (at >= ticksFrom && left < secondsLeftAt(t - 1)) playVoice(ctx, SOUNDS[soundFor(left)], at, out);
  }
  return ctx.startRendering();
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

  const frames = (CLIP_FPS * CLIP_MS) / 1000;
  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, withIntro(frameStateAt(startMs + (i * 1000) / CLIP_FPS, true), i / CLIP_FPS));
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
