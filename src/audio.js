let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function tone(ctx, freq, startTime, duration, type = "sine", volume = 0.45) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export function playAlarm(type = "default") {
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;

    switch (type) {
      case "bells":
        // Ascending bell tones with natural decay
        [523, 659, 784, 880].forEach((freq, i) => {
          tone(ctx, freq, t + i * 0.28, 0.8, "sine", 0.4);
        });
        break;

      case "chime":
        // Descending pentatonic chime
        [1047, 880, 784, 659, 523].forEach((freq, i) => {
          tone(ctx, freq, t + i * 0.32, 0.7, "sine", 0.42);
        });
        break;

      case "beep":
        // Three short crisp beeps
        [0, 0.22, 0.44].forEach(offset => {
          tone(ctx, 880, t + offset, 0.14, "square", 0.28);
        });
        break;

      default:
        // Default: two-tone pulse repeated twice
        [0, 0.5].forEach(rep => {
          tone(ctx, 440, t + rep, 0.22, "sine", 0.5);
          tone(ctx, 550, t + rep + 0.22, 0.22, "sine", 0.5);
        });
    }
  } catch {
    // AudioContext may be blocked before first user interaction — fail silently
  }
}
