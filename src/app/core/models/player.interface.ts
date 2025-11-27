import { RadioStation } from './radio.interface';

/**
 * Player State
 */
export interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentStation: RadioStation | null;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

/**
 * Volume Change Event
 */
export interface VolumeChangeEvent {
  volume: number;
  isMuted: boolean;
}

/**
 * Playback Event
 */
export interface PlaybackEvent {
  type: 'play' | 'pause' | 'stop' | 'error' | 'loading' | 'buffering';
  station?: RadioStation;
  timestamp: Date;
  error?: string;
}

/**
 * Audio Player Configuration
 */
export interface PlayerConfig {
  autoPlay?: boolean;
  defaultVolume?: number;
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
}
