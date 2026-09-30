// Web Audio API Synthesizer for Casino Slot Machine Sound Effects
// Zero external asset dependencies — works offline & reliably across all browsers

let audioCtx: AudioContext | null = null;

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

    // Metallic clunk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    // Spring rattle
    setTimeout(() => {
      if (!ctx) return;
      const springOsc = ctx.createOscillator();
      const springGain = ctx.createGain();
      springOsc.type = 'triangle';
      springOsc.frequency.setValueAtTime(320, ctx.currentTime);
      springOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);

      springGain.gain.setValueAtTime(0.12, ctx.currentTime);
      springGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      springOsc.connect(springGain);
      springGain.connect(ctx.destination);
      springOsc.start();
      springOsc.stop(ctx.currentTime + 0.19);
    }, 60);
  } catch {
    // Ignore audio permission errors
  }
}

// 2. Ratchet Reel Spin Tick
export function playTickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // Ignore
  }
}

// 3. Heavy Reel Stop Clunk
export function playReelClunk(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Deep sub-bass thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);

    // Mechanical click atop the thud
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(800, ctx.currentTime);
    click.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    clickGain.gain.setValueAtTime(0.15, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start();
    click.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore
  }
}

// 4. Casino Jackpot Fanfare & Coin Cascade Sound
export function playJackpotFanfare(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Victory arpeggio (C5, G5, C6, E6, G6)
    const fanfareNotes = [523.25, 783.99, 1046.5, 1318.51, 1567.98];
    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.52);
    });

    // Payout coin drop bells
    const coinDelay = 0.5;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (!ctx) return;
        const coinOsc = ctx.createOscillator();
        const coinGain = ctx.createGain();

        coinOsc.type = 'triangle';
        coinOsc.frequency.setValueAtTime(1800 + Math.random() * 900, ctx.currentTime);
        coinOsc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

        coinGain.gain.setValueAtTime(0.08, ctx.currentTime);
        coinGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        coinOsc.connect(coinGain);
        coinGain.connect(ctx.destination);

        coinOsc.start();
        coinOsc.stop(ctx.currentTime + 0.09);
      }, (coinDelay + i * 0.07) * 1000);
    }
  } catch {
    // Ignore
  }
}

export function playSuccessSound(enabled = true) {
  playJackpotFanfare(enabled);
}
