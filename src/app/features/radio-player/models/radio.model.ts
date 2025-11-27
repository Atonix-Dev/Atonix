export interface Radio {
  changeuuid: string;
  stationuuid: string;
  serveruuid?: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  codec: string;
  bitrate: number;
  lastchangetime?: Date;
  clickcount: number;
  clicktrend: number;
}

export interface StationFilter {
  countrycode?: string;
  limit?: number;
  offset?: number;
  order?: string;
  reverse?: boolean;
  name?: string;
  tag?: string;
}