let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isAudioUnlocked = false;

function playDualTones(lowFreq, highFreq, duration = 0.2) {
  // Ensure the AudioContext is unlocked
  if (!isAudioUnlocked && audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      console.log("AudioContext resumed!");
      isAudioUnlocked = true;
    });
  }

  // Log frequencies to confirm they are being passed
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

  // Log start time
  let startTime = audioCtx.currentTime;
  console.log(`Start time for both tones: ${startTime}`);

  // Start both oscillators at the same time
  lowOscillator.start(startTime);
  highOscillator.start(startTime);

  // Stop the oscillators after the duration
  lowOscillator.stop(startTime + duration);
  highOscillator.stop(startTime + duration);

  console.log('Tones started simultaneously');
}

document.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);  // Log key press
  const keyFreqMap = {
    'a': { lowFreq: 200, highFreq: 400 },
    'b': { lowFreq: 300, highFreq: 600 },
    'c': { lowFreq: 400, highFreq: 800 },
    // Add other keys and corresponding frequencies
  };

  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { lowFreq, highFreq } = keyFreqMap[key];
    playDualTones(lowFreq, highFreq);
  }
});
