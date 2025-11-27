import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Player } from '../../models/player.model';
import { NavStationService } from '../../services/nav-station.service';
import { StationListServiceService } from '../../services/station-list-service.service';
import { Station } from '../../core/models/interfaces';

@Component({
  selector: 'audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.css']
})
export class AudioPlayerComponent implements OnInit, OnChanges, OnDestroy {
  public stationList: Station[] = [];
  public station: Station | null = null;
  public index: number = 0;
  public audio!: Player;
  public isErrorMessage: boolean = false;
  public isLoading: boolean = false;
  private errorCounter: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private navStationService: NavStationService,
    private stationListService: StationListServiceService
  ) {}

  ngOnInit(): void {
    this.navStationService.getStationIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe(newIndex => {
        this.index = newIndex;
        this.station = this.stationList[this.index] || null;
        if (this.station) {
          this.createPlayer();
        }
      });

    this.stationListService.getStationList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newStationList: Station[]) => {
        this.stationList = newStationList;
        this.station = this.stationList[this.index] || null;
        if (this.station) {
          this.createPlayer();
        }
      });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.station = this.stationList[this.index] || null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.audio) {
      this.audio.stop();
    }
  }

  createPlayer(): void {
    if (!this.station) {
      return;
    }

    this.isLoading = true;
    this.audio = Player.getInstance(this.station.url_resolved, 'radioPlayer')!;
    this.audio.start()
      .then(() => {
        this.errorCounter = 0;
        this.isErrorMessage = false;
      })
      .catch(() => {
        this.errorCounter++;
        if (this.errorCounter >= 5) {
          this.showFatalError();
          return;
        }
        if (this.index < this.stationList.length - 1) {
          this.nextClick();
        } else {
          this.index = 0;
          this.station = this.stationList[this.index] || null;
          this.createPlayer();
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  playPause(): void {
    if (this.audio) {
      this.audio.playPause();
    }
  }

  showFatalError(): void {
    this.isErrorMessage = true;
  }

  nextClick(): void {
    this.index = this.index + 1;
    this.station = this.stationList[this.index] || null;
    this.navStationService.setStationIndex(this.index);
    this.createPlayer();
  }

  backClick(): void {
    if (this.index > 0) {
      this.index = this.index - 1;
    } else {
      this.index = this.stationList.length - 1;
    }
    this.station = this.stationList[this.index] || null;
    this.navStationService.setStationIndex(this.index);
    this.createPlayer();
  }
}



