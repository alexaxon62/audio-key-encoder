let audioCtx;
let seed = '';

function startEncoder() {
  // Initialize AudioContext
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Get seed from input
  seed = document.getElementById('seedInput').value || 'default';

  // Add key listener if not already added
  if (!window.keyListenerAdded) {
    document.addEventListener('keydown', handleKeyPress);
    window.keyListenerAdded = true;
  }

  alert('Encoder started! Press keys to hear tones.');
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();
  if (!/^[a-z0-9]$/.test(key)) return; // Only handle a-z, 0-9

  const [freq1, freq2] = getFrequenciesForKey(key, seed);
  playDualTone(freq1, freq2);
}

// Simple seeded hash function to derive frequencies
function getFrequenciesForKey(char, seed) {
  const combined = char + seed;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }

  // Generate two frequencies between typical DTMF ranges
  const baseFreqs1 = [697, 770, 852, 941]; // low group
  const baseFreqs2 = [1209, 1336, 1477, 1633]; // high group

  const freq1 = baseFreqs1[Math.abs(hash) % baseFreqs1.length];
  const freq2 = baseFreqs2[Math.abs(hash >> 2) % baseFreqs2.length];

  return [freq1, freq2];
}

// Play both tones together
function playDualTone(freq1, freq2, duration = 0.2) {
  const now = audioCtx.currentTime;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.connect(audioCtx.destination);

  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, now);
  osc1.connect(gain);

  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq2, now);
  osc2.connect(gain);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}
