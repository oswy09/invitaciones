// Web Audio API Synthesizer for Baby Lullaby
// Brahms' Lullaby (Canción de Cuna)
// Frequency map
const notesMap: { [key: string]: number } = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'F#4': 369.99, 'G#4': 415.30, 'A#4': 466.16,
};

// Notes and durations of Brahms' Lullaby (Tu-ru-ru, Tu-ru-ru...)
// Structure: [Note, duration in beats] - 1 beat = approx 0.5s (120 bpm, 3/4 time)
const BRAHMS_LULLABY: [string, number][] = [
  ['E4', 1], ['E4', 1], ['G4', 2],
  ['E4', 1], ['E4', 1], ['G4', 2],
  ['E4', 1], ['G4', 1], ['C5', 2], ['B4', 1.5], ['A4', 1.5],
  ['G4', 2], ['D4', 1], ['E4', 1], ['F4', 2],
  ['D4', 1], ['E4', 1], ['F4', 2],
  ['D4', 1], ['F4', 1], ['B4', 2], ['A4', 1.5], ['G4', 1.5],
  ['C5', 2.5], ['C4', 1], ['C4', 1],
  ['C5', 3], ['A4', 1], ['F4', 1], ['G4', 2],
  ['E4', 1], ['C4', 1], ['F4', 1.5], ['G4', 0.5], ['A4', 1.5], ['G4', 1.5],
  ['C5', 3], ['A4', 1], ['F4', 1], ['G4', 2],
  ['E4', 1], ['C4', 1], ['D4', 2], ['B4', 1], ['C5', 3]
];

export class LullabySynth {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private currentNoteIndex = 0;
  private isPlaying = false;
  private tempo = 120; // BPM (beats per minute)
  private beatDuration = 60 / this.tempo; // 0.5 seconds
  private nextNoteTime = 0;
  private onNotePlayedCallback?: (note: string) => void;

  constructor(onNotePlayed?: (note: string) => void) {
    if (onNotePlayed) {
      this.onNotePlayedCallback = onNotePlayed;
    }
  }

  public setOnNotePlayed(callback: (note: string) => void) {
    this.onNotePlayedCallback = callback;
  }

  public start() {
    if (this.isPlaying) return;

    // Lazy initialization of AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("Speech/AudioContext is not supported in this browser.");
      return;
    }

    this.ctx = new AudioContextClass();
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;

    // Start scheduling loop
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  private scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    // Schedule short ahead
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.playNextNote();
    }

    // Check back in 25ms
    this.timerId = window.setTimeout(() => this.scheduler(), 25);
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    const [note, durationBeats] = BRAHMS_LULLABY[this.currentNoteIndex];
    const durationSeconds = durationBeats * this.beatDuration * 0.95; // slightly detached

    if (note !== 'REST' && notesMap[note]) {
      this.synthesizeTone(notesMap[note], this.nextNoteTime, durationSeconds);
      if (this.onNotePlayedCallback) {
        // Run on main thread safely
        setTimeout(() => {
          if (this.isPlaying && this.onNotePlayedCallback) {
            this.onNotePlayedCallback(note);
          }
        }, Math.max(0, (this.nextNoteTime - this.ctx!.currentTime) * 1000));
      }
    }

    // Update next note time
    this.nextNoteTime += durationBeats * this.beatDuration;

    // Loop
    this.currentNoteIndex = (this.currentNoteIndex + 1) % BRAHMS_LULLABY.length;
  }

  private synthesizeTone(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Soft celestial triangle oscillator or sine wave
    osc.type = 'triangle';
    osc.frequency.value = freq;

    // Simple resonance filter for music box feel
    filter.type = 'lowpass';
    filter.frequency.value = 1300;
    filter.Q.value = 2.0;

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime);
    // Sweet attack
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
    // Smooth decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}
