import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Radio } from '../../models/radio.model';
import { Player } from '../../models/player.model';
import { PlayerState } from '../../../../core/enums/player.enum';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnChanges {
  @Input() station: Radio | null = null;
  
  player: Player | null = null;
  isPlaying = false;
  isLoading = false;
  hasError = false;
  volume = 0.7;
  PlayerState = PlayerState;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['station'] && this.station) {
      this.playStation();
    }
  }

  private async playStation(): Promise<void> {
    if (!this.station) return;

    this.isLoading = true;
    this.hasError = false;

    try {
      this.player = Player.getInstance(this.station.url_resolved, 'radioPlayer');
      this.player.setVolume(this.volume);
      await this.player.start();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing station:', error);
      this.hasError = true;
      this.isPlaying = false;
    } finally {
      this.isLoading = false;
    }
  }

  togglePlay(): void {
    if (!this.player) return;
    this.player.playPause();
    this.isPlaying = this.player.isPlaying();
  }

  onVolumeChange(event: any): void {
    this.volume = parseFloat(event.target.value);
    if (this.player) {
      this.player.setVolume(this.volume);
    }
  }
}