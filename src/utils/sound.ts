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
// 1. ULTRA-FUN VEGAS DISCO-FUNK SYNTHESIZER
// 124 BPM Upbeat, bouncy groove with slap bass, snare claps, and arcade lead hooks
// ==========================================
const BPM = 124;
const STEP_TIME = (60 / BPM) / 4; // 16th note in seconds (~0.12s)

// Funky slap bassline with syncopated octave bounces (in Hz)
// C2=65.4, C3=130.8, Eb2=77.8, F2=87.3, F3=174.6, G2=98.0, G3=196.0, Bb2=116.5, A1=55.0, A2=110.0
const BASS_NOTES = [
  65.4, 0, 130.8, 65.4, 0, 77.8, 98.0, 130.8,    // Bar 1: C funk bounce
  87.3, 0, 174.6, 87.3, 98.0, 0, 196.0, 116.5,    // Bar 2: F -> G slap
  55.0, 0, 110.0, 55.0, 65.4, 0, 130.8, 98.0,     // Bar 3: Am groove
  87.3, 87.3, 98.0, 0, 116.5, 130.8, 146.8, 196.0 // Bar 4: Walking fill
];

// Synth Chords (Cmaj9, Fadd9, Am7, G7sus4)
const CHORD_PROGRESSION = [
  [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
  [349.23, 440.00, 523.25, 659.25, 698.46], // Fadd9
  [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
  [392.00, 440.00, 523.25, 587.33, 698.46], // G9sus4
];

// Playful, catchy arcade synth melody lead notes (pentatonic hooks)
const LEAD_NOTES: (number | null)[] = [
  null, null, 523.25, 659.25, null, 783.99, null, 1046.5,  // Bar 1 spark
  null, 783.99, null, 659.25, 587.33, null, 523.25, null, // Bar 2 answer
  null, null, 440.00, 523.25, null, 659.25, null, 880.00,  // Bar 3 run
  1046.5, null, 880.00, 783.99, null, 1046.5, 1174.66, 1318.51 // Bar 4 triumph
];

function playHiHat(ctx: AudioContext, time: number, open = false) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(open ? 8500 : 11000, time);

  filter.type = 'highpass';
  filter.frequency.setValueAtTime(7500, time);

  const dur = open ? 0.09 : 0.035;
  gain.gain.setValueAtTime(open ? 0.05 : 0.035, time);
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
  osc.frequency.setValueAtTime(155, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.1);

  gain.gain.setValueAtTime(0.24, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

  osc.connect(gain);
  if (musicMasterGain) gain.connect(musicMasterGain);

  osc.start(time);
  osc.stop(time + 0.15);
}

// Snappy Snare / Hand Clap on beats 2 and 4 (Disco-Funk bounce!)
function playSnareClap(ctx: AudioContext, time: number) {
  // Body tone
  const toneOsc = ctx.createOscillator();
  const toneGain = ctx.createGain();
  toneOsc.type = 'triangle';
  toneOsc.frequency.setValueAtTime(220, time);
  toneOsc.frequency.exponentialRampToValueAtTime(80, time + 0.07);

  toneGain.gain.setValueAtTime(0.12, time);
  toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  toneOsc.connect(toneGain);
  if (musicMasterGain) toneGain.connect(musicMasterGain);

  toneOsc.start(time);
  toneOsc.stop(time + 0.09);

  // Snappy noise clap crack
  const noiseOsc = ctx.createOscillator();
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();

  noiseOsc.type = 'sawtooth';
  noiseOsc.frequency.setValueAtTime(2400, time);

  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1800, time);
  noiseFilter.Q.setValueAtTime(1.8, time);

  noiseGain.gain.setValueAtTime(0.14, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

  noiseOsc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  if (musicMasterGain) noiseGain.connect(musicMasterGain);

  noiseOsc.start(time);
  noiseOsc.stop(time + 0.12);
}

function playBass(ctx: AudioContext, freq: number, time: number) {
  if (freq === 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, time);
  filter.frequency.exponentialRampToValueAtTime(180, time + 0.16);

  // Slap pop envelope
  gain.gain.setValueAtTime(0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.19);

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
    filter.frequency.setValueAtTime(1400, time);

    gain.gain.setValueAtTime(0.038, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    if (musicMasterGain) gain.connect(musicMasterGain);

    osc.start(time);
    osc.stop(time + 0.18);
  });
}

function playLead(ctx: AudioContext, freq: number, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, time);
  filter.frequency.exponentialRampToValueAtTime(800, time + 0.18);

  gain.gain.setValueAtTime(0.045, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  if (musicMasterGain) gain.connect(musicMasterGain);

  osc.start(time);
  osc.stop(time + 0.2);
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

  // Master Gain for Upbeat Vegas Music
  musicMasterGain = ctx.createGain();
  musicMasterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  musicMasterGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.4);
  musicMasterGain.connect(ctx.destination);

  isMusicPlaying = true;
  currentStep = 0;
  let nextStepTime = ctx.currentTime + 0.05;

  musicIntervalId = setInterval(() => {
    if (!ctx || !isMusicPlaying) return;

    while (nextStepTime < ctx.currentTime + 0.25) {
      const step32 = currentStep % 32;
      const barIndex = Math.floor(step32 / 8);

      // 1. Kick drum on 1, 2, 3, 4 (every 4 steps: 0, 4, 8, 12...)
      if (step32 % 4 === 0) {
        playKick(ctx, nextStepTime);
      }

      // 2. Snappy Snare Clap on beats 2 & 4 (steps 4, 12, 20, 28)
      if (step32 % 8 === 4) {
        playSnareClap(ctx, nextStepTime);
      }

      // 3. Upbeat Hi-hats with disco swing
      if (step32 % 2 === 1) {
        playHiHat(ctx, nextStepTime, step32 % 4 === 3);
      }

      // 4. Slap Bassline with syncopated octave bounce
      const bassFreq = BASS_NOTES[step32];
      playBass(ctx, bassFreq, nextStepTime);

      // 5. Upbeat Chord Stabs on upbeat 16ths
      if (step32 % 8 === 2 || step32 % 8 === 6) {
        playStab(ctx, CHORD_PROGRESSION[barIndex], nextStepTime);
      }

      // 6. Playful Arcade Lead Synth Hook
      const leadNote = LEAD_NOTES[step32];
      if (leadNote !== null) {
        playLead(ctx, leadNote, nextStepTime);
      }

      nextStepTime += STEP_TIME;
      currentStep++;
    }
  }, 35);
}

// ==========================================
// INTERACTIVE UI SOUNDS (RECIPE & TABS)
// ==========================================
export function playRecipeCheckSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Cheerful double chime
    const notes = [880, 1320];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.13);
    });
  } catch {
    // Ignore
  }
}

export function playTabSwitchSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {
    // Ignore
  }
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
