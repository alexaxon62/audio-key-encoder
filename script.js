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

  // Start both tones at the same time
  lowOscillator.start();
  highOscillator.start();

  // Stop the oscillators after the duration
  lowOscillator.stop(audioCtx.currentTime + duration);
  highOscillator.stop(audioCtx.currentTime + duration);
}
