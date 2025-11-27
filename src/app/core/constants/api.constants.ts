
/**
 * API Constants
 * Centralized API configuration following best practices
 */

export const API_CONFIG = {
  BASE_URL: 'https://de1.api.radio-browser.info/json/stations',
  ENDPOINTS: {
    SEARCH: '/search',
    BY_UUID: '/byuuid',
    BY_NAME: '/byname',
    BY_COUNTRY: '/bycountry',
    BY_TAG: '/bytag'
  },
  DEFAULT_PARAMS: {
    countrycode: 'AR',
    limit: 300,
    offset: 0,
    order: 'votes',
    reverse: true
  }
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'radio_app_auth_token',
  USER_DATA: 'radio_app_user_data',
  FAVORITES: 'radio_app_favorites',
  RECENT_STATIONS: 'radio_app_recent',
  THEME_PREFERENCE: 'radio_app_theme'
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Radio App',
  VERSION: '2.0.0',
  MAX_RECENT_STATIONS: 10,
  MAX_FAVORITES: 50,
  DEBOUNCE_TIME: 300,
  DEFAULT_COUNTRY: 'AR'
} as const;
