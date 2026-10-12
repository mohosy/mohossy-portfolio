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

// The start time lives in localStorage so a 1000-day run survives reloads.
let startedAtCache: number | null | undefined;
const startedAtListeners = new Set<() => void>();

function readStartedAt(): number | null {
  if (startedAtCache === undefined) {
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY));
      startedAtCache = stored > 0 ? stored : null;
    } catch {
      startedAtCache = null;
    }
  }
  return startedAtCache;
}

function writeStartedAt(value: number | null) {
  startedAtCache = value;
  try {
    if (value === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Storage blocked (private mode): the run still works until the tab closes.
  }
  startedAtListeners.forEach((listener) => listener());
}

function subscribeStartedAt(listener: () => void) {
  startedAtListeners.add(listener);
  return () => {
    startedAtListeners.delete(listener);
  };
}

const subscribeNoop = () => () => {};

// The count is a pure function of time since START, so any moment can be redrawn exactly.
function secondsLeftAt(elapsedMs: number) {
  return Math.max(0, TOTAL_SECONDS - Math.floor(Math.max(0, elapsedMs) / 1000));
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function daysText(seconds: number) {
  return String(Math.floor(seconds / 86_400)).padStart(3, "0");
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
  title: { size: 52, y: 470, spacing: 10 },
  days: { size: 330, y: 900 },
  daysLabel: { size: 52, y: 1000, spacing: 10 },
  hms: { size: 170, y: 1290 },
  hmsLabel: { size: 40, y: 1372, spacing: 6 },
};

const ENTER_MS = 320;
const EXIT_MS = 220;
const COLLAPSE_MS = 300;

const backOut = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;
const easeOut = (p: number) => 1 - (1 - p) ** 2;

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const widths = [...text].map((char) => ctx.measureText(char).width);
  let x = cx - (widths.reduce((sum, w) => sum + w, 0) + spacing * (text.length - 1)) / 2;
  ctx.textAlign = "left";
  [...text].forEach((char, i) => {
    ctx.fillText(char, x, y);
    x += widths[i] + spacing;
  });
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

  // Old and new text are aligned from the right, so 1000 -> 999 collapses the leading slot.
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

function drawFrame(ctx: CanvasRenderingContext2D, elapsedMs: number, animate: boolean) {
  const family = minecraft.style.fontFamily;
  const tick = Math.floor(Math.max(0, elapsedMs) / 1000);
  const now = secondsLeftAt(elapsedMs);
  const before = tick > 0 ? secondsLeftAt(tick * 1000 - 1) : now;
  const sinceMs = animate && before !== now ? elapsedMs - tick * 1000 : null;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";

  const { title, days, daysLabel, hms, hmsLabel } = LAYOUT;
  ctx.font = `${title.size}px ${family}`;
  drawSpaced(ctx, "1000 DAY COUNTDOWN", FRAME_W / 2, title.y, title.spacing);

  ctx.font = `${days.size}px ${family}`;
  drawRollingRow(ctx, daysText(now), daysText(before), sinceMs, days.y);
  ctx.font = `${daysLabel.size}px ${family}`;
  drawSpaced(ctx, "DAYS", FRAME_W / 2, daysLabel.y, daysLabel.spacing);

  ctx.font = `${hms.size}px ${family}`;
  const slots = drawRollingRow(ctx, hmsText(now), hmsText(before), sinceMs, hms.y);
  ctx.font = `${hmsLabel.size}px ${family}`;
  ["HOURS", "MINUTES", "SECONDS"].forEach((label, i) => {
    const first = slots[i * 3];
    const second = slots[i * 3 + 1];
    drawSpaced(ctx, label, (first.x + second.x + second.w) / 2, hmsLabel.y, hmsLabel.spacing);
  });
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
    drawFrame(ctx, startMs + (i * 1000) / CLIP_FPS, true);
    await video.add(i / CLIP_FPS, 1 / CLIP_FPS);
    if (i % 10 === 0) onProgress(i / frames);
  }
  await audio.add(await renderClipAudio(startMs));
  await output.finalize();

  const daysLeft = Math.floor(secondsLeftAt(startMs + CLIP_MS) / 86_400);
  return new File([output.target.buffer!], `countdown-${daysLeft}-days.mp4`, { type: "video/mp4" });
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

type ExportState =
  | { status: "idle" }
  | { status: "rendering"; progress: number }
  | { status: "ready"; file: File }
  | { status: "error"; message: string };

const buttonClass =
  "border-4 border-black bg-white px-3 py-3 text-base text-black shadow-[5px_5px_0_0_#000] transition-[transform,box-shadow] duration-75 hover:bg-black hover:text-white active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-25 sm:px-7 sm:text-xl";

export function ThousandDayCountdown() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const startedAt = useSyncExternalStore(subscribeStartedAt, readStartedAt, () => null);
  const [fontReady, setFontReady] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveTextRef = useRef<HTMLParagraphElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const soundOnRef = useRef(soundOn);

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
      const rolling = elapsed - Math.floor(elapsed / 1000) * 1000 < ENTER_MS + 50;
      if (seconds !== lastSeconds || rolling) drawFrame(ctx, elapsed, animate);
      if (seconds !== lastSeconds) {
        if (lastSeconds !== null && seconds < lastSeconds) play(soundFor(seconds));
        if (liveTextRef.current) {
          liveTextRef.current.textContent = `${Math.floor(seconds / 86_400)} days, ${hmsText(seconds)} left`;
        }
      }
      lastSeconds = seconds;
      if (startedAt !== null && seconds > 0) frame = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [startedAt, fontReady, play]);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => setConfirmReset(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirmReset]);

  const handleStart = () => {
    unlockAudio();
    writeStartedAt(Date.now());
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
    writeStartedAt(null);
    play("reset");
  };

  const handleDownload = async () => {
    // Phones need a fresh tap to open the share sheet, so a finished clip waits for one.
    if (exportState.status === "ready") {
      const { file } = exportState;
      setExportState({ status: "idle" });
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        if ((error as Error).name !== "AbortError") saveFile(file);
      }
      return;
    }

    const elapsed = startedAt === null ? 0 : Date.now() - startedAt;
    setExportState({ status: "rendering", progress: 0 });
    try {
      const file = await renderClip(clipStartMs(elapsed), (progress) =>
        setExportState({ status: "rendering", progress }),
      );
      const isPhone = window.matchMedia("(pointer: coarse)").matches;
      if (isPhone && navigator.canShare?.({ files: [file] })) {
        setExportState({ status: "ready", file });
      } else {
        saveFile(file);
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

  const running = startedAt !== null;
  const downloadLabel =
    exportState.status === "rendering"
      ? `${Math.round(exportState.progress * 100)}%`
      : exportState.status === "ready"
        ? "SAVE VIDEO"
        : "DOWNLOAD";

  return (
    <div className={`${minecraft.className} flex w-full flex-col items-center gap-6 px-4`}>
      <h1 className="sr-only">1000 Day Countdown</h1>
      <canvas
        ref={canvasRef}
        width={FRAME_W}
        height={FRAME_H}
        role="img"
        aria-label="1000 day countdown"
        className="aspect-[9/16] border border-neutral-200 bg-white"
        style={{ height: "min(76svh, calc((100vw - 32px) * 16 / 9))" }}
      />
      <p ref={liveTextRef} className="sr-only" role="timer" />

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <button type="button" className={buttonClass} onClick={handleStart} disabled={!hydrated || running}>
          START
        </button>
        <button type="button" className={buttonClass} onClick={handleReset} disabled={!hydrated || !running}>
          {confirmReset ? "SURE?" : "RESET"}
        </button>
        <button
          type="button"
          className={`${buttonClass} min-w-[7.5em] sm:min-w-[8.5em]`}
          onClick={handleDownload}
          disabled={!fontReady || exportState.status === "rendering"}
        >
          {downloadLabel}
        </button>
      </div>

      {exportState.status === "error" && (
        <p className="max-w-sm text-center text-sm text-neutral-600">{exportState.message}</p>
      )}

      <button
        type="button"
        className="text-sm tracking-[0.2em] text-neutral-500 hover:text-black"
        onClick={() => setSoundOn((on) => !on)}
      >
        {!soundOn ? "SOUND: OFF" : running && !audioUnlocked ? "TAP FOR SOUND" : "SOUND: ON"}
      </button>
    </div>
  );
}
