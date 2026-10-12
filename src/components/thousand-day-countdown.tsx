"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const TOTAL_SECONDS = 1000 * 86_400;
const STORAGE_KEY = "mohossy-count-started-at";

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

let noiseBuffer: AudioBuffer | null = null;

function getNoise(ctx: AudioContext) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function playKnocks(ctx: AudioContext, knocks: Knock[]) {
  const now = ctx.currentTime;
  for (const { pitch: basePitch, at = 0, gain: baseGain = 1, decay = 0.06 } of knocks) {
    const t = now + at;
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
    noise.connect(band).connect(noiseAmp).connect(ctx.destination);
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
    body.connect(bodyAmp).connect(ctx.destination);
    body.start(t);
    body.stop(t + decay + 0.02);
  }
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden px-[0.05em]">
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

function Clock({ seconds }: { seconds: number }) {
  const groups = [
    { label: "DAYS", short: "DAYS", value: String(Math.floor(seconds / 86_400)).padStart(3, "0") },
    { label: "HOURS", short: "HRS", value: String(Math.floor((seconds % 86_400) / 3600)).padStart(2, "0") },
    { label: "MINUTES", short: "MIN", value: String(Math.floor((seconds % 3600) / 60)).padStart(2, "0") },
    { label: "SECONDS", short: "SEC", value: String(seconds % 60).padStart(2, "0") },
  ];

  return (
    <div className="flex items-start justify-center">
      {groups.map((group, groupIndex) => {
        const digits = group.value.split("");
        return (
          <div key={group.label} className="flex items-start">
            {groupIndex > 0 && <span className="h-[1.15em]">:</span>}
            <div className="flex flex-col items-center">
              <div className="flex">
                <AnimatePresence initial={false}>
                  {digits.map((digit, i) => (
                    // Keyed from the right so 1000 -> 999 drops the leading slot.
                    <motion.span
                      key={digits.length - 1 - i}
                      className="inline-block overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      exit={{ width: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Digit value={digit} />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              {/* Zero-width box so long labels don't push the digit groups apart. */}
              <span className="flex w-0 justify-center whitespace-nowrap">
                <span className="mt-[0.6em] text-[max(0.16em,0.65rem)] tracking-[0.1em] [text-shadow:none] sm:tracking-[0.2em]">
                  <span className="sm:hidden">{group.short}</span>
                  <span className="hidden sm:inline">{group.label}</span>
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const buttonClass =
  "border-4 border-black bg-white px-7 py-4 text-lg text-black shadow-[6px_6px_0_0_#000] transition-[transform,box-shadow] duration-75 hover:bg-black hover:text-white active:translate-x-[6px] active:translate-y-[6px] active:shadow-none disabled:pointer-events-none disabled:opacity-25 sm:px-10 sm:text-2xl";

export function ThousandDayCountdown() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const startedAt = useSyncExternalStore(subscribeStartedAt, readStartedAt, () => null);
  const [liveSeconds, setLiveSeconds] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const soundOnRef = useRef(soundOn);
  const lastSecondRef = useRef<number | null>(null);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

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

  // Wake up on each second boundary and derive the time left from the start timestamp,
  // so the count never drifts no matter how long the tab stays open.
  useEffect(() => {
    if (startedAt === null) return;
    let timer = 0;
    const step = () => {
      const leftMs = Math.min(TOTAL_SECONDS * 1000, TOTAL_SECONDS * 1000 - (Date.now() - startedAt));
      const second = Math.max(0, Math.ceil(leftMs / 1000));
      const last = lastSecondRef.current;
      if (last !== null && second < last && document.visibilityState === "visible") {
        if (second === 0) play("done");
        else if (second % 60 === 0) play("minute");
        else play(second % 2 ? "tick" : "tock");
      }
      lastSecondRef.current = second;
      setLiveSeconds(second);
      if (second > 0) timer = window.setTimeout(step, (leftMs % 1000 || 1000) + 10);
    };
    timer = window.setTimeout(step, 0);
    return () => window.clearTimeout(timer);
  }, [startedAt, play]);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => setConfirmReset(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirmReset]);

  const handleStart = () => {
    unlockAudio();
    lastSecondRef.current = TOTAL_SECONDS;
    setLiveSeconds(TOTAL_SECONDS);
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
    lastSecondRef.current = null;
    setLiveSeconds(null);
    writeStartedAt(null);
    play("reset");
  };

  const seconds = startedAt === null ? TOTAL_SECONDS : liveSeconds;
  const running = startedAt !== null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex w-full flex-col items-center gap-12 px-4 text-center sm:gap-16">
        <h1 className="text-xl tracking-[0.25em] sm:text-3xl">1000 DAY COUNTDOWN</h1>

        <div
          className="w-full text-[clamp(2.25rem,9.5vw,10rem)] leading-[1.15] tabular-nums [text-shadow:0.08em_0.08em_0_#d4d4d4]"
          role="timer"
          aria-live="off"
        >
          {hydrated && seconds !== null ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <span className="sr-only">
                {`${Math.floor(seconds / 86_400)} days, ${Math.floor((seconds % 86_400) / 3600)} hours, ${Math.floor((seconds % 3600) / 60)} minutes, ${seconds % 60} seconds left`}
              </span>
              <div aria-hidden="true">
                <Clock seconds={seconds} />
              </div>
            </motion.div>
          ) : (
            <div className="invisible" aria-hidden="true">
              <Clock seconds={TOTAL_SECONDS} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <button type="button" className={buttonClass} onClick={handleStart} disabled={!hydrated || running}>
            START
          </button>
          <button type="button" className={buttonClass} onClick={handleReset} disabled={!hydrated || !running}>
            {confirmReset ? "SURE?" : "RESET"}
          </button>
        </div>

        <button
          type="button"
          className="text-sm tracking-[0.2em] text-neutral-500 hover:text-black"
          onClick={() => setSoundOn((on) => !on)}
        >
          {!soundOn ? "SOUND: OFF" : running && !audioUnlocked ? "TAP FOR SOUND" : "SOUND: ON"}
        </button>
      </div>
    </MotionConfig>
  );
}
