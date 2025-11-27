/**
 * Consolidated Radio Station Interface
 * Centralized model for all radio station data
 */
export interface RadioStation {
  // Core Identifiers
  stationuuid: string;
  changeuuid?: string;
  serveruuid?: string;

  // Basic Information
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;

  // Location
  country: string;
  countrycode: string;
  state: string;
  iso_3166_2?: string | null;
  geo_lat?: number | null;
  geo_long?: number | null;

  // Language
  language: string;
  languagecodes: string;

  // Technical Info
  codec: string;
  bitrate: number;
  hls?: number;
  ssl_error?: number;

  // Popularity Metrics
  votes: number;
  clickcount: number;
  clicktrend: number;
  clicktimestamp?: string | Date;
  clicktimestamp_iso8601?: string | Date;

  // Check Status
  lastcheckok?: number;
  lastchecktime?: string | Date;
  lastchecktime_iso8601?: string | Date;
  lastcheckoktime?: string | Date;
  lastcheckoktime_iso8601?: string | Date;
  lastlocalchecktime?: string | Date;
  lastlocalchecktime_iso8601?: string | Date;

  // Change Tracking
  lastchangetime?: string | Date;
  lastchangetime_iso8601?: string | Date;

  // Extended Info
  has_extended_info?: boolean;

  // Client-side properties
  id?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

/**
 * Station Filter Options
 */
export interface StationFilters {
  country?: string;
  countrycode?: string;
  language?: string;
  tag?: string;
  name?: string;
  limit?: number;
  offset?: number;
  order?: 'name' | 'votes' | 'clickcount' | 'bitrate';
  reverse?: boolean;
}

/**
 * Country Information
 */
export interface Country {
  name: string;
  code: string;
  stationCount?: number;
}

/**
 * Language Information
 */
export interface RadioLanguage {
  name: string;
  code: string;
  stationCount?: number;
}

/**
 * Tag Information
 */
export interface Tag {
  name: string;
  stationCount?: number;
}

/**
 * Filter Options for UI
 */
export interface FilterOptions {
  countries: Country[];
  languages: RadioLanguage[];
  tags: Tag[];
  limits: number[];
}

/**
 * Search Result
 */
export interface StationSearchResult {
  stations: RadioStation[];
  total: number;
  query: string;
  filters?: StationFilters;
}
