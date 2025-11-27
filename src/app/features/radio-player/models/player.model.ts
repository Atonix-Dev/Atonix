import { PlayerState, PlayerError } from '../../../core/enums/player.enum';

export class Player {
  private static instance: Player | null = null;
  private audio: HTMLAudioElement;
  private state: PlayerState = PlayerState.IDLE;

  private constructor(src: string, id: string) {
    this.audio = document.getElementById(id) as HTMLAudioElement;
    if (!this.audio) {
      this.audio = document.createElement('audio');
      this.audio.id = id;
      document.body.appendChild(this.audio);
    }
    this.audio.src = src;
    this.audio.crossOrigin = 'anonymous';
  }

  static getInstance(src: string, id: string): Player {
    if (!Player.instance) {
      Player.instance = new Player(src, id);
    } else {
      Player.instance.audio.src = src;
    }
    return Player.instance;
  }

  async start(): Promise<void> {
    this.state = PlayerState.LOADING;
    try {
      this.audio.load();
      await this.audio.play();
      this.state = PlayerState.PLAYING;
    } catch (error) {
      this.state = PlayerState.ERROR;
      throw error;
    }
  }

  playPause(): void {
    if (this.audio.paused) {
      this.audio.play();
      this.state = PlayerState.PLAYING;
    } else {
      this.audio.pause();
      this.state = PlayerState.PAUSED;
    }
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state = PlayerState.IDLE;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getState(): PlayerState {
    return this.state;
  }

  isPlaying(): boolean {
    return this.state === PlayerState.PLAYING;
  }
}