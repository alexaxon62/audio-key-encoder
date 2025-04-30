let keyFreqMap = {};
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashSeedToInt(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function createKeyFrequencyMap(seed) {
  const keys = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
  const seedInt = hashSeedToInt(seed);
  let map = {};

  keys.forEach((key, index) => {
    const rand = seededRandom(seedInt + index);
    map[key] = 200 + Math.floor(rand * 1800);
  });

  return map;
}

function playFrequency(freq, duration = 0.2) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

function startEncoder() {
  const seed = document.getElementById("seedInput").value;
  if (!seed) {
    alert("Please enter a seed.");
    return;
  }

  keyFreqMap = createKeyFrequencyMap(seed);
  alert("Seed loaded! Now press keys to hear encoded sounds.");

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (keyFreqMap[key]) {
      playFrequency(keyFreqMap[key]);
    }
 });
}
