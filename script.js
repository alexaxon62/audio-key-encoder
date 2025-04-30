let audioCtx;
let seed = '';

function startEncoder() {
  // Create AudioContext once and resume if needed
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  seed = document.getElementById('seedInput').value || 'default';

  if (!window.keyListenerAdded) {
    document.addEventListener('keydown', handleKeyPress);
    window.keyListenerAdded = true;
  }

  alert('Encoder started! Press keys to hear tones.');
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();
  if (!/^[a-z0-9]$/.test(key)) return;

  const [freq1, freq2] = getFrequenciesForKey(key, seed);
  playDualTone(freq1, freq2);
}

function getFrequenciesForKey(char, seed) {
  const combined = char + seed;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }

  const lowFreqs = [697, 770, 852, 941];
  const highFreqs = [1209, 1336, 1477, 1633];

  const freq1 = lowFreqs[Math.abs(hash) % lowFreqs.length];
  const freq2 = highFreqs[Math.abs(hash >> 2) % highFreqs.length];

  return [freq1, freq2];
}

function playDualTone(freq1, freq2, duration = 0.2) {
  const now = audioCtx.currentTime;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.connect(audioCtx.destination);

  // Oscillator 1
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, now);
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + duration);

  // Oscillator 2
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq2, now);
  osc2.connect(gainNode);
  osc2.start(now);
  osc2.stop(now + duration);
}
