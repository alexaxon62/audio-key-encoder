let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function hashSeededTones(key, seed) {
  const input = new TextEncoder().encode(key + seed);
  return crypto.subtle.digest("SHA-256", input).then(buffer => {
    const view = new DataView(buffer);
    // Extract two 32-bit integers from the hash
    const val1 = view.getUint32(0, true);
    const val2 = view.getUint32(4, true);
    const tone1 = 300 + (val1 % 1200); // 300–1500Hz
    const tone2 = 300 + (val2 % 1200);
    return [tone1, tone2];
  });
}

function playTwoTones(freq1, freq2, duration = 0.3) {
  const oscillator1 = audioCtx.createOscillator();
  const oscillator2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator1.type = 'sine';
  oscillator2.type = 'sine';
  oscillator1.frequency.value = freq1;
  oscillator2.frequency.value = freq2;

  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const startTime = audioCtx.currentTime;
  oscillator1.start(startTime);
  oscillator2.start(startTime);
  oscillator1.stop(startTime + duration);
  oscillator2.stop(startTime + duration);
}

document.addEventListener("keydown", (e) => {
  const seed = document.getElementById("seed").value.trim();
  if (!seed) {
    console.warn("Seed is required");
    return;
  }

  const key = e.key.toLowerCase();
  if (key.length === 1 && key.match(/[a-z0-9]/i)) {
    hashSeededTones(key, seed).then(([tone1, tone2]) => {
      console.log(`Key: ${key}, Tone1: ${tone1} Hz, Tone2: ${tone2} Hz`);
      playTwoTones(tone1, tone2);
    });
  }
});
