
let audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Create audio context

function playTwoTones(freq1, freq2, duration = 0.2) {
  let oscillator1 = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator1.type = 'sine';
  oscillator2.type = 'sine';
  oscillator1.frequency.setValueAtTime(freq1, audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(freq2, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator1.connect(gain);
  oscillator2.connect(gain);
  gain.connect(audioCtx.destination);

  let startTime = audioCtx.currentTime;

  oscillator1.start(startTime);
  oscillator2.start(startTime);

  oscillator1.stop(startTime + duration);
  oscillator2.stop(startTime + duration);
}

document.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);

  const keyFreqMap = {
    'a': { tone1: 440, tone2: 880 },
    'b': { tone1: 523, tone2: 1046 },
    'c': { tone1: 261, tone2: 523 },
  };

  const key = e.key.toLowerCase();
  if (keyFreqMap[key]) {
    const { tone1, tone2 } = keyFreqMap[key];
    playTwoTones(tone1, tone2);
  }
});
