// Web Audio API Synthesizer for Casino Slot Machine & Upbeat Vegas Music
// Zero external asset dependencies — works offline & reliably across all browsers

let audioCtx: AudioContext | null = null;
let musicMasterGain: GainNode | null = null;
let isMusicPlaying = false;
let musicIntervalId: ReturnType<typeof setInterval> | null = null;
let currentStep = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ==========================================
// 1. UPBEAT CASINO GROOVE SYNTHESIZER
// 124 BPM Upbeat Nu-Disco / Vegas Synth Groove
// ==========================================
const BPM = 124;
const STEP_TIME = (60 / BPM) / 4; // 16th note in seconds (~0.12s)

// Bassline notes (C3, E3, G3, A2, F2, G2)
const BASS_NOTES = [
  130.81, 0, 130.81, 0, 164.81, 0, 196.00, 130.81, // Bar 1 (C)
  174.61, 0, 174.61, 0, 196.00, 0, 130.81, 146.83, // Bar 2 (F -> G)
  110.00, 0, 110.00, 0, 130.81, 0, 164.81, 110.00, // Bar 3 (Am)
  174.61, 0, 196.00, 0, 220.00, 196.00, 174.61, 196.00 // Bar 4 (F -> G)
];

// Synth Chords (Cmaj7, Fmaj7, Am7, Gsus4)
const CHORD_PROGRESSION = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [349.23, 440.00, 523.25, 659.25], // Fmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [392.00, 440.00, 523.25, 587.33], // Gsus4
];

function playHiHat(ctx: AudioContext, time: number, open = false) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(open ? 8000 : 10000, time);

  filter.type = 'highpass';
  filter.frequency.setValueAtTime(7000, time);

  const dur = open ? 0.08 : 0.03;
  gain.gain.setValueAtTime(0.04, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  osc.connect(filter);
  filter.connect(gain);
  if (musicMasterGain) gain.connect(musicMasterGain);

  osc.start(time);
  osc.stop(time + dur + 0.01);
}

function playKick(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.09);

  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

  osc.connect(gain);
  if (musicMasterGain) gain.connect(musicMasterGain);

  osc.start(time);
  osc.stop(time + 0.13);
}

function playBass(ctx: AudioContext, freq: number, time: number) {
  if (freq === 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, time);
  filter.frequency.exponentialRampToValueAtTime(200, time + 0.15);

  gain.gain.setValueAtTime(0.12, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  if (musicMasterGain) gain.connect(musicMasterGain);

  osc.start(time);
  osc.stop(time + 0.2);
}

function playStab(ctx: AudioContext, notes: number[], time: number) {
  notes.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);

    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    if (musicMasterGain) gain.connect(musicMasterGain);

    osc.start(time);
    osc.stop(time + 0.2);
  });
}

export function toggleCasinoAmbience(enabled: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (!enabled) {
    if (musicMasterGain) {
      musicMasterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    }
    if (musicIntervalId) {
      clearInterval(musicIntervalId);
      musicIntervalId = null;
    }
    isMusicPlaying = false;
    return;
  }

  if (isMusicPlaying) return;

  // Master Gain for Upbeat Music
  musicMasterGain = ctx.createGain();
  musicMasterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  musicMasterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.5);
  musicMasterGain.connect(ctx.destination);

  isMusicPlaying = true;
  currentStep = 0;
  let nextStepTime = ctx.currentTime + 0.05;

  musicIntervalId = setInterval(() => {
    if (!ctx || !isMusicPlaying) return;

    while (nextStepTime < ctx.currentTime + 0.25) {
      const step16 = currentStep % 32;
      const barIndex = Math.floor(step16 / 8);

      // Kick drum on quarter beats (steps 0, 4, 8, 12, etc.)
      if (step16 % 4 === 0) {
        playKick(ctx, nextStepTime);
      }

      // Upbeat Hi-hats on off-beats
      if (step16 % 2 === 1) {
        playHiHat(ctx, nextStepTime, step16 % 4 === 2);
      }

      // Funky Bassline
      const bassFreq = BASS_NOTES[step16];
      playBass(ctx, bassFreq, nextStepTime);

      // Upbeat Chord Stabs on upbeat 2 and 4
      if (step16 % 8 === 2 || step16 % 8 === 6) {
        playStab(ctx, CHORD_PROGRESSION[barIndex], nextStepTime);
      }

      nextStepTime += STEP_TIME;
      currentStep++;
    }
  }, 40);
}

// ==========================================
// 2. MECHANICAL LEVER PULL
// ==========================================
export function playLeverPullSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Heavy mechanical gear tooth click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);

    // Spring oscillation
    setTimeout(() => {
      if (!ctx) return;
      const springOsc = ctx.createOscillator();
      const springGain = ctx.createGain();
      springOsc.type = 'triangle';
      springOsc.frequency.setValueAtTime(380, ctx.currentTime);
      springOsc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.22);

      springGain.gain.setValueAtTime(0.18, ctx.currentTime);
      springGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      springOsc.connect(springGain);
      springGain.connect(ctx.destination);
      springOsc.start();
      springOsc.stop(ctx.currentTime + 0.23);
    }, 70);
  } catch {
    // Ignore
  }
}

// ==========================================
// 3. REEL SOUNDS & TICKS
// ==========================================
export function playTickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700 + Math.random() * 250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.036);
  } catch {
    // Ignore
  }
}

export function playAnticipationTick(pitchMultiplier = 1, enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 920 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.48, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Ignore
  }
}

export function playReelClunk(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.38, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);

    // Metallic payline latch
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sawtooth';
    click.frequency.setValueAtTime(980, ctx.currentTime);
    click.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.05);
    clickGain.gain.setValueAtTime(0.2, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start();
    click.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore
  }
}

export function playSubBassClunk(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(135, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(26, ctx.currentTime + 0.4);

    subGain.gain.setValueAtTime(0.55, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.42);
  } catch {
    // Ignore
  }
}

// ==========================================
// 4. UPBEAT CELEBRATION FANFARE
// ==========================================
export function playJackpotFanfare(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Upbeat celebratory major chord fanfare (C5, E5, G5, C6, D6, E6, G6)
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98];
    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.66);
    });

    // Payout coin bells
    const coinDelay = 0.6;
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        if (!ctx) return;
        const coinOsc = ctx.createOscillator();
        const coinGain = ctx.createGain();

        coinOsc.type = 'sine';
        coinOsc.frequency.setValueAtTime(1800 + Math.random() * 1200, ctx.currentTime);
        coinOsc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.08);

        coinGain.gain.setValueAtTime(0.1, ctx.currentTime);
        coinGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        coinOsc.connect(coinGain);
        coinGain.connect(ctx.destination);

        coinOsc.start();
        coinOsc.stop(ctx.currentTime + 0.09);
      }, (coinDelay + i * 0.06) * 1000);
    }
  } catch {
    // Ignore
  }
}

export function playSuccessSound(enabled = true) {
  playJackpotFanfare(enabled);
}
