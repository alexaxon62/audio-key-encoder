let audioCtx;
let seed1 = '';
let seed2 = '';

function startEncoder() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Resume context in case browser suspends it initially
  audioCtx.resume().then(() => {
    seed1 = document.getElementById('seedInput1').value || 'seed1';
    seed2 = document.getElementById('seedInput2').value || 'seed2';

    if (!window.keyListenerAdded) {
      document.addEventListener('keydown', handleKeyPress);
      window.keyListenerAdded = true;
    }

    alert('Encoder started! Press keys to hear tones.');
  });
}

function handleKeyPress(e) {
  const key = e.key.toLowerCase();
  if (!/^[a-z0-9]$/.test(key)) return;

  const freq1 = hashToFrequency(key + seed1);
  const freq2 = hashToFrequency(key + seed2);
  playDualTone(freq1, freq2);
}

function hashToFrequency(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  const base = 200;
  const range = 2000;
  return base + (Math.abs(hash) % range);
}

function playDualTone(freq1, freq2, duration = 0.3) {
  const now = audioCtx.currentTime;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.connect(audioCtx.destination);

  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq1, now);
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + duration);

  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq2, now);
  osc2.connect(gainNode);
  osc2.start(now);
  osc2.stop(now + duration);
}
