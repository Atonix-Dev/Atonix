import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RadioService } from '../../services/radio.service';
import { RadioStation, StationFilters } from '../../../../core/models';

/**
 * Radio Player Component
 *
 * Main component for radio player functionality
 * Implements OnDestroy to prevent memory leaks
 * Uses OnPush change detection for better performance
 */
@Component({
  selector: 'app-radio-player',
  templateUrl: './radio-player.component.html',
  styleUrls: ['./radio-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioPlayerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  stations: RadioStation[] = [];
  filteredStations: RadioStation[] = [];
  currentStation: RadioStation | null = null;
  isLoading = false;
  searchQuery = '';
  error: string | null = null;

  constructor(private radioService: RadioService) {}

  ngOnInit(): void {
    // Subscribe with proper cleanup using takeUntil
    this.radioService.stations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stations => {
        this.stations = stations;
        this.filteredStations = stations;
      });

    this.radioService.currentStation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(station => {
        this.currentStation = station;
      });

    this.radioService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.radioService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });

    // Load initial stations
    this.loadStations({});
  }

  ngOnDestroy(): void {
    // Complete the destroy subject to unsubscribe from all observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load stations with filters
   */
  loadStations(filters: Partial<StationFilters>): void {
    this.radioService.fetchStations(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error loading stations:', error);
        }
      });
  }

  /**
   * Handle filter changes
   */
  onFilterChange(filters: Partial<StationFilters>): void {
    this.loadStations(filters);
  }

  /**
   * Handle station selection
   */
  onStationSelect(station: RadioStation): void {
    this.radioService.setCurrentStation(station);
  }

  /**
   * Handle search query
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    if (!query) {
      this.filteredStations = this.stations;
    } else {
      this.radioService.searchByName(query)
        .pipe(takeUntil(this.destroy$))
        .subscribe(filtered => {
          this.filteredStations = filtered;
        });
    }
  }

  /**
   * Track by function for ngFor performance
   */
  trackByStationId(index: number, station: RadioStation): string {
    return station.stationuuid;
  }
}
