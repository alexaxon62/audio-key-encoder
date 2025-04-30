let audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Create audio context

function playTwoTones(freq1, freq2, duration = 0.2) {
  // Create two oscillators (one for each tone)
  let oscillator1 = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  // Set oscillator types and frequencies
  oscillator1.type = 'sine';  // sine wave for oscillator 1
  oscillator2.type = 'sine';  // sine wave for oscillator 2
  oscillator1.frequency.setValueAtTime(freq1, audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(freq2, audioCtx.currentTime);

  // Set gain (volume control)
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  // Connect both oscillators to the gain, then to the speakers (destination)
  oscillator1.connect(gain);
  oscillator2.connect(gain);
  gain.connect(audioCtx.destination);

  // Get the current time (when both tones will start)
  let startTime = audioCtx.currentTime;

  // Start both oscillators at the same time
  oscillator1.start(startTime);
  oscillator2.start(startTime);

  // Stop the oscillators after the specified duration
  oscillator1.stop(startTime + duration);
  oscillator2.stop(startTime + duration);
}

// Event listener for keydown to trigger dual tone playback
document.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);  // Log key press

  // Define a map of key presses to frequencies
  const keyFreqMap = {
    'a': { tone1: 440, tone2: 880 },  // Example: A key -> Tone 1: 440Hz, Tone 2: 880Hz
    'b': { tone1: 523, tone2: 1046 }, // Example: B key -> Tone 1: 523Hz, Tone 2: 1046Hz
    'c': { tone1: 261, tone2: 523 },  // Example: C key -> Tone 1: 261Hz, Tone 2: 523Hz
    // Add other keys with different frequencies as needed
  };

  // Get the corresponding frequencies for the pressed key
  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { tone1, tone2 } = keyFreqMap[key];
    playTwoTones(tone1, tone2);  // Play two tones simultaneously
  }
});
