// Web Audio API Synthesizer for Casino Slot Machine Sound Effects
// High-fidelity sound design with zero external asset dependencies

let audioCtx: AudioContext | null = null;
let ambienceGainNode: GainNode | null = null;
let isAmbienceRunning = false;

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

// 1. Mechanical Lever Pull: Heavy metallic latch and spring release
export function playLeverPullSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Heavy mechanical gear tooth click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
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
      springOsc.frequency.setValueAtTime(360, ctx.currentTime);
      springOsc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.22);

      springGain.gain.setValueAtTime(0.16, ctx.currentTime);
      springGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      springOsc.connect(springGain);
      springGain.connect(ctx.destination);
      springOsc.start();
      springOsc.stop(ctx.currentTime + 0.23);
    }, 70);
  } catch {
    // Ignore audio permission errors
  }
}

// 2. Ratchet Reel Spin Tick (Fast cycling)
export function playTickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650 + Math.random() * 250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.036);
  } catch {
    // Ignore
  }
}

// 3. Anticipation Tick (Dramatic Slowing Reel)
export function playAnticipationTick(pitchMultiplier = 1, enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 880 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    // Ignore
  }
}

// 4. Heavy Reel Stop Clunk
export function playReelClunk(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Deep sub-bass thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);

    // Metallic payline latch
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'sawtooth';
    click.frequency.setValueAtTime(950, ctx.currentTime);
    click.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);
    clickGain.gain.setValueAtTime(0.18, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start();
    click.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore
  }
}

// 5. Final Sub-Bass Drop (Dramatic Final Jackpot Lock)
export function playSubBassClunk(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 0.38);

    subGain.gain.setValueAtTime(0.5, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.4);
  } catch {
    // Ignore
  }
}

// 6. Casino Jackpot Fanfare & Coin Cascade Sound
export function playJackpotFanfare(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Victory brass chord progression
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.11);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.11 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.11 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.11);
      osc.stop(ctx.currentTime + idx * 0.11 + 0.66);
    });

    // Payout coin drop bells
    const coinDelay = 0.65;
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (!ctx) return;
        const coinOsc = ctx.createOscillator();
        const coinGain = ctx.createGain();

        coinOsc.type = 'sine';
        coinOsc.frequency.setValueAtTime(1700 + Math.random() * 1100, ctx.currentTime);
        coinOsc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.09);

        coinGain.gain.setValueAtTime(0.09, ctx.currentTime);
        coinGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

        coinOsc.connect(coinGain);
        coinGain.connect(ctx.destination);

        coinOsc.start();
        coinOsc.stop(ctx.currentTime + 0.1);
      }, (coinDelay + i * 0.065) * 1000);
    }
  } catch {
    // Ignore
  }
}

// 7. Ambient Casino Floor Sound (Gentle room tone & distant electronic chimes)
export function toggleCasinoAmbience(enabled: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!enabled && ambienceGainNode) {
      ambienceGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      isAmbienceRunning = false;
      return;
    }

    if (enabled && !isAmbienceRunning) {
      ambienceGainNode = ctx.createGain();
      ambienceGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambienceGainNode.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.2);
      ambienceGainNode.connect(ctx.destination);

      // Low frequency hum
      const humOsc = ctx.createOscillator();
      humOsc.type = 'sine';
      humOsc.frequency.setValueAtTime(65, ctx.currentTime);
      humOsc.connect(ambienceGainNode);
      humOsc.start();

      isAmbienceRunning = true;
    }
  } catch {
    // Ignore
  }
}

export function playSuccessSound(enabled = true) {
  playJackpotFanfare(enabled);
}
