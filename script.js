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
    let lowFreq = 200 + Math.floor(seededRandom(seedInt + index) * 1000);
    let highFreq = 1200 + Math.floor(seededRandom(seedInt + index + 100) * 1000);

    // Ensure the frequencies are different
    if (lowFreq === highFreq) {
      highFreq = lowFreq + 100; // Make the high frequency 100Hz greater if they are equal
    }

    map[key] = { lowFreq, highFreq };
  });

  return map;
}

function playDualTones(lowFreq, highFreq, duration = 0.2) {
  console.log(`Playing tones: Low - ${lowFreq}Hz, High - ${highFreq}Hz`);

  let lowOscillator = audioCtx.createOscillator();
  let highOscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  lowOscillator.type = 'sine';
  highOscillator.type = 'sine';

  lowOscillator.frequency.setValueAtTime(lowFreq, audioCtx.currentTime);
  highOscillator.frequency.setValueAtTime(highFreq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  lowOscillator.connect(gain);
  highOscillator.connect(gain);
  gain.connect(audioCtx.destination);

  // Start the low tone
  lowOscillator.start();
  console.log('Low tone started');

  // Start the high tone slightly after the low tone
  highOscillator.start(audioCtx.currentTime + duration);
  console.log('High tone started after delay');

  // Stop the oscillators after the duration
  lowOscillator.stop(audioCtx.currentTime + duration);
  highOscillator.stop(audioCtx.currentTime + duration + 0.2); // Stop the high tone slightly later
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
