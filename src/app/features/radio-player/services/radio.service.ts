import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap, finalize, retry } from 'rxjs/operators';
import { RadioStation, StationFilters } from '../../../core/models';
import { API_CONFIG } from '../../../core/constants/api.constants';

/**
 * Enhanced Radio Service with HttpClient
 *
 * Features:
 * - HttpClient instead of raw fetch()
 * - Proper error handling
 * - Retry logic for failed requests
 * - Type-safe with RadioStation interface
 * - Reactive state management with BehaviorSubjects
 */
@Injectable({
  providedIn: 'root'
})
export class RadioService {
  private stationsSubject$ = new BehaviorSubject<RadioStation[]>([]);
  private currentStationSubject$ = new BehaviorSubject<RadioStation | null>(null);
  private isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  private errorSubject$ = new BehaviorSubject<string | null>(null);

  public stations$ = this.stationsSubject$.asObservable();
  public currentStation$ = this.currentStationSubject$.asObservable();
  public isLoading$ = this.isLoadingSubject$.asObservable();
  public error$ = this.errorSubject$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetch radio stations with filters
   * @param filters - Station filter options
   * @returns Observable<RadioStation[]>
   */
  fetchStations(filters: Partial<StationFilters> = {}): Observable<RadioStation[]> {
    this.isLoadingSubject$.next(true);
    this.errorSubject$.next(null);

    // Build HTTP params
    let params = new HttpParams();

    // Add default params
    Object.entries(API_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });

    // Add filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}`;

    return this.http.get<RadioStation[]>(url, { params }).pipe(
      retry(2), // Retry failed requests twice
      map(stations => this.processStations(stations)),
      tap(stations => {
        this.stationsSubject$.next(stations);
        this.errorSubject$.next(null);
      }),
      catchError(error => this.handleError(error)),
      finalize(() => this.isLoadingSubject$.next(false))
    );
  }

  /**
   * Search stations by name
   * @param name - Station name to search
   * @returns Observable<RadioStation[]>
   */
  searchByName(name: string): Observable<RadioStation[]> {
    if (!name || name.trim().length === 0) {
      return this.stations$;
    }

    const normalizedSearch = name.toLowerCase().trim();

    return this.stations$.pipe(
      map(stations =>
        stations.filter(station =>
          station.name.toLowerCase().includes(normalizedSearch) ||
          station.tags.toLowerCase().includes(normalizedSearch) ||
          station.country.toLowerCase().includes(normalizedSearch)
        )
      )
    );
  }

  /**
   * Get stations by country
   * @param countryCode - ISO country code
   * @returns Observable<RadioStation[]>
   */
  getStationsByCountry(countryCode: string): Observable<RadioStation[]> {
    return this.fetchStations({ countrycode: countryCode });
  }

  /**
   * Get stations by tag/genre
   * @param tag - Genre tag
   * @returns Observable<RadioStation[]>
   */
  getStationsByTag(tag: string): Observable<RadioStation[]> {
    return this.fetchStations({ tag });
  }

  /**
   * Get top voted stations
   * @param limit - Number of stations to fetch
   * @returns Observable<RadioStation[]>
   */
  getTopStations(limit: number = 50): Observable<RadioStation[]> {
    return this.fetchStations({
      order: 'votes',
      reverse: true,
      limit
    });
  }

  /**
   * Get popular stations (by click count)
   * @param limit - Number of stations to fetch
   * @returns Observable<RadioStation[]>
   */
  getPopularStations(limit: number = 50): Observable<RadioStation[]> {
    return this.fetchStations({
      order: 'clickcount',
      reverse: true,
      limit
    });
  }

  /**
   * Set current playing station
   * @param station - Station to set as current
   */
  setCurrentStation(station: RadioStation | null): void {
    this.currentStationSubject$.next(station);
  }

  /**
   * Get current stations array
   * @returns RadioStation[] - Current stations
   */
  getStations(): RadioStation[] {
    return this.stationsSubject$.value;
  }

  /**
   * Get current station
   * @returns RadioStation | null - Current playing station
   */
  getCurrentStation(): RadioStation | null {
    return this.currentStationSubject$.value;
  }

  /**
   * Clear all stations
   */
  clearStations(): void {
    this.stationsSubject$.next([]);
    this.currentStationSubject$.next(null);
    this.errorSubject$.next(null);
  }

  /**
   * Process and normalize station data
   * @param stations - Raw station data
   * @returns RadioStation[] - Processed stations
   */
  private processStations(stations: RadioStation[]): RadioStation[] {
    return stations.map(station => ({
      ...station,
      name: station.name?.trim() || 'Unknown Station',
      favicon: station.favicon || this.getDefaultFavicon(),
      tags: station.tags?.trim() || '',
      country: station.country?.trim() || '',
      isPlaying: false,
      isFavorite: false
    }));
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching stations';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    console.error('RadioService Error:', errorMessage, error);
    this.errorSubject$.next(errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get default favicon for stations without one
   * @returns string - Default favicon URL
   */
  private getDefaultFavicon(): string {
    return 'assets/images/default-radio-icon.png';
  }
}
