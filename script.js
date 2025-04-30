let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isAudioUnlocked = false;

function playDualTones(lowFreq, highFreq, duration = 0.2) {
  // Ensure the AudioContext is unlocked and resumed when needed
  if (!isAudioUnlocked && audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      console.log("AudioContext resumed!");
      isAudioUnlocked = true;
    });
  }

  // Log frequencies to confirm they are being passed correctly
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

  // Set gain level
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  // Connect oscillators to the gain node, then to the destination (speaker)
  lowOscillator.connect(gain);
  highOscillator.connect(gain);
  gain.connect(audioCtx.destination);

  // Log the time both oscillators should start
  let startTime = audioCtx.currentTime;
  console.log(`Start time for both tones: ${startTime}`);

  // Start both oscillators at the same exact time
  lowOscillator.start(startTime);
  highOscillator.start(startTime);

  // Stop both oscillators after the given duration
  lowOscillator.stop(startTime + duration);
  highOscillator.stop(startTime + duration);

  console.log('Tones should be playing simultaneously');
}

// Event listener for keydown to trigger dual tone playback
document.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);  // Log the key press
  const keyFreqMap = {
    'a': { lowFreq: 772, highFreq: 1487 },
    'b': { lowFreq: 880, highFreq: 1567 },
    'c': { lowFreq: 1000, highFreq: 1750 },
    // Add more mappings as needed
  };

  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { lowFreq, highFreq } = keyFreqMap[key];
    playDualTones(lowFreq, highFreq);
  }
});
