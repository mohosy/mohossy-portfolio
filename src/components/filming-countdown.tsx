"use client";

import { AnimatePresence, motion } from "framer-motion";
import localFont from "next/font/local";
import { useCallback, useEffect, useRef, useState } from "react";

const minecraft = localFont({
  src: "../fonts/Minecraft.ttf",
  display: "block",
});

const TOTAL_SECONDS = 1000 * 86_400;

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

function groups(seconds: number) {
  return [
    { label: "DAYS", value: pad(Math.floor(seconds / 86_400), 3) },
    { label: "HRS", value: pad(Math.floor((seconds % 86_400) / 3600)) },
    { label: "MIN", value: pad(Math.floor((seconds % 3600) / 60)) },
    { label: "SEC", value: pad(seconds % 60) },
  ];
}

// Each digit rolls down into place when it changes.
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden px-[0.04em]">
      <span className="invisible">0</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 text-center"
          initial={{ y: "-100%" }}
          animate={{ y: "0%", transition: { duration: 0.32, ease: [0.34, 1.56, 0.64, 1] } }}
          exit={{ y: "100%", transition: { duration: 0.22, ease: "easeIn" } }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The same crisp watch tick as the /count page: a tiny ~5 kHz click with a faint ping.
function playTick(ctx: AudioContext, detune: number) {
  const t = ctx.currentTime;
  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
  const data = noise.getChannelData(0);
  let seed = 20260512;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 16807) % 2147483647;
    data[i] = (seed / 2147483647) * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 5200 * detune;
  band.Q.value = 2.5;
  const click = ctx.createGain();
  click.gain.setValueAtTime(0.57, t);
  click.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);
  src.connect(band).connect(click).connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.03);

  const ping = ctx.createOscillator();
  ping.frequency.value = 3400 * detune;
  const ring = ctx.createGain();
  ring.gain.setValueAtTime(0.0001, t);
  ring.gain.exponentialRampToValueAtTime(0.063, t + 0.003);
  ring.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);
  ping.connect(ring).connect(ctx.destination);
  ping.start(t);
  ping.stop(t + 0.05);
}

// A short low button click for pressing START.
function playPress(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(0.35, t + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

export function FilmingCountdown() {
  // Nothing is saved: every reload starts a fresh 1000 days, ready for the next take.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  const secondsLeft = startedAt === null ? TOTAL_SECONDS : Math.max(0, TOTAL_SECONDS - Math.floor((now - startedAt) / 1000));

  // Wake up on each second boundary after START.
  useEffect(() => {
    if (startedAt === null) return;
    let timer = 0;
    const step = () => {
      const current = Date.now();
      setNow(current);
      timer = window.setTimeout(step, 1000 - ((current - startedAt) % 1000) + 5);
    };
    timer = window.setTimeout(step, 0);
    return () => window.clearTimeout(timer);
  }, [startedAt]);

  useEffect(() => {
    const ctx = audioRef.current;
    if (startedAt === null || !ctx || secondsLeft === TOTAL_SECONDS || secondsLeft === 0) return;
    playTick(ctx, secondsLeft % 2 ? 1 : 0.88);
  }, [secondsLeft, startedAt]);

  const start = useCallback(() => {
    audioRef.current ??= new AudioContext();
    void audioRef.current.resume();
    playPress(audioRef.current);
    const at = Date.now();
    setNow(at);
    setStartedAt(at);
  }, []);

  const [fullscreen, setFullscreen] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // In full screen the mouse pointer hides after a moment of stillness, so it's not in the shot.
  useEffect(() => {
    if (!fullscreen) return;
    let timer = window.setTimeout(() => setCursorHidden(true), 1500);
    const onMove = () => {
      setCursorHidden(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCursorHidden(true), 1500);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", onMove);
      setCursorHidden(false);
    };
  }, [fullscreen]);

  // Keyboard: R resets between takes, F toggles full screen.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "r" || event.key === "R") setStartedAt(null);
      if (event.key === "f" || event.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  const started = startedAt !== null;

  return (
    <div className={`${minecraft.className} flex w-full flex-col items-center gap-[min(8vh,72px)] px-4`}>
      <h1 className="sr-only">1000 day countdown</h1>
      {fullscreen && cursorHidden && <style>{"*{cursor:none!important}"}</style>}
      {!fullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="fixed right-4 top-4 touch-manipulation select-none border-[3px] border-black bg-[#8b8b8b] px-4 py-2 text-base tracking-[0.06em] text-white shadow-[inset_3px_3px_0_#c6c6c6,inset_-3px_-3px_0_#555] [text-shadow:0.12em_0.12em_0_#3f3f3f] hover:bg-[#9a9fcf] active:translate-y-[2px] active:bg-[#6f6f6f] active:shadow-[inset_3px_3px_0_#4a4a4a,inset_-3px_-3px_0_#9a9a9a]"
        >
          FULL SCREEN
        </button>
      )}
      <div className="flex items-start justify-center text-[min(11vw,22vh)] leading-[1.15]" role="timer" aria-label={`${secondsLeft} seconds left`}>
        {groups(secondsLeft).map((group, i) => (
          <div key={group.label} className="flex items-start">
            {i > 0 && <span className="h-[1.15em]">:</span>}
            <div className="flex flex-col items-center">
              <div className="flex">
                <AnimatePresence initial={false}>
                  {group.value.split("").map((digit, d, all) => (
                    // Keyed from the right, so 1000 -> 999 slides the leading "1" away smoothly.
                    <motion.span
                      key={all.length - 1 - d}
                      className="inline-block overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      exit={{ width: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <Digit value={digit} />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <span className="mt-[0.35em] text-[max(0.14em,12px)] tracking-[0.2em] text-neutral-500">{group.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* A classic Minecraft stone button: grey face, light top-left bevel, dark bottom-right. */}
      <button
        type="button"
        onClick={start}
        disabled={started}
        className={`touch-manipulation select-none border-[5px] border-black px-[min(9vw,96px)] py-[min(3vw,28px)] text-[clamp(28px,4.2vw,60px)] tracking-[0.06em] text-white [text-shadow:0.12em_0.12em_0_#3f3f3f] transition-[transform,background-color] duration-75 ${
          started
            ? "translate-y-[4px] bg-[#6f6f6f] shadow-[inset_6px_6px_0_#4a4a4a,inset_-6px_-6px_0_#9a9a9a]"
            : "bg-[#8b8b8b] shadow-[inset_6px_6px_0_#c6c6c6,inset_-6px_-6px_0_#555] hover:bg-[#9a9fcf] hover:shadow-[inset_6px_6px_0_#d4d8ff,inset_-6px_-6px_0_#5a5f8f] active:translate-y-[4px] active:bg-[#6f6f6f] active:shadow-[inset_6px_6px_0_#4a4a4a,inset_-6px_-6px_0_#9a9a9a]"
        }`}
      >
        START
      </button>
    </div>
  );
}
