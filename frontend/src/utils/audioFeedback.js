export const isAudioFeedbackEnabled = () => {
  try {
    const raw = localStorage.getItem('elite_attendance_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.soundEnabled === 'boolean') {
        return parsed.soundEnabled;
      }
    }
  } catch (_) {}
  return true;
};

export const playScanSuccessBeep = () => {
  if (!isAudioFeedbackEnabled()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

export const playScanErrorBeep = () => {
  if (!isAudioFeedbackEnabled()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.25);
    osc.stop(ctx.currentTime + 0.25);
  } catch (_) {}
};