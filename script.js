let keyFreqMap = {};
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isAudioUnlocked = false;

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
    // Generate two frequencies: one low and one high for each key
    const lowFreq = 200 + Math.floor(seededRandom(seedInt + index) * 1000); // low frequency
    const highFreq = 1200 + Math.floor(seededRandom(seedInt + index + 100) * 1000); // high frequency
    map[key] = { lowFreq, highFreq };
  });

  return map;
}

function playDualTones(lowFreq, highFreq, duration = 0.2) {
  let lowOscillator = audioCtx.createOscillator();
  let highOscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  // Set frequencies and type
  lowOscillator.type = 'sine';
  highOscillator.type = 'sine';
  
  lowOscillator.frequency.setValueAtTime(lowFreq, audioCtx.currentTime);
  highOscillator.frequency.setValueAtTime(highFreq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  // Connect the oscillators to the gain node and then to the audio context
  lowOscillator.connect(gain);
  highOscillator.connect(gain);
  gain.connect(audioCtx.destination);

  // Start the low frequency, then high frequency
  lowOscillator.start();
  highOscillator.start(audioCtx.currentTime + duration);

  lowOscillator.stop(audioCtx.currentTime + duration);
  highOscillator.stop(audioCtx.currentTime + duration + 0.2); // A little overlap for the second tone
}

function startEncoder() {
  const seed = document.getElementById("seedInput").value;
  if (!seed) {
    alert("Please enter a seed.");
    return;
  }

  // Unlock audio on first interaction (button click)
  if (!isAudioUnlocked) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    isAudioUnlocked = true;
  }

  keyFreqMap = createKeyFrequencyMap(seed);
  alert("Seed loaded! Now press keys to hear dual tone encoded sounds.");
}

// Listen for keypresses
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { lowFreq, highFreq } = keyFreqMap[key];
    playDualTones(lowFreq, highFreq);
  }
});
