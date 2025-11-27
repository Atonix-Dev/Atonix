
/**
 * Player related enumerations
 */

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  LOADING = 'loading',
  ERROR = 'error',
  IDLE = 'idle'
}

export enum PlayerError {
  NETWORK_ERROR = 'network_error',
  DECODE_ERROR = 'decode_error',
  NOT_SUPPORTED = 'not_supported',
  UNKNOWN = 'unknown'
}
