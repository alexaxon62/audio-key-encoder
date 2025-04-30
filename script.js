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

    if (lowFreq === highFreq) {
      highFreq = lowFreq + 100;
    }

    map[key] = { lowFreq, highFreq };
  });

  return map;
}

function playDualTones(lowFreq, highFreq, duration = 0.2) {
  console.log(`Playing tones: Low - ${lowFreq}Hz, High - ${highFreq}Hz`);

  // Create oscillators
  let lowOscillator = audioCtx.createOscillator();
  let highOscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  // Set oscillator types and frequencies
  lowOscillator.type = 'sine';
  highOscillator.type = 'sine';

  lowOscillator.frequency.setValueAtTime(lowFreq, audioCtx.currentTime);
  highOscillator.frequency.setValueAtTime(highFreq, audioCtx.currentTime);

  // Set gain
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  // Connect oscillators to gain and then to the destination
  lowOscillator.connect(gain);
  highOscillator.connect(gain);
  gain.connect(audioCtx.destination);

  // Get the current time and start both oscillators at the same time
  let startTime = audioCtx.currentTime;
  console.log(`Start time for both tones: ${startTime}`);

  lowOscillator.start(startTime);
  highOscillator.start(startTime);

  // Stop the oscillators after the duration
  lowOscillator.stop(startTime + duration);
  highOscillator.stop(startTime + duration);

  console.log('Tones started simultaneously');
}

function startEncoder() {
  const seed = document.getElementById("seedInput").value;
  if (!seed) {
    alert("Please enter a seed.");
    return;
  }

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
  console.log(`Key pressed: ${e.key}`);  // Log the key pressed to the console
  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { lowFreq, highFreq } = keyFreqMap[key];
    playDualTones(lowFreq, highFreq);
  }
});
