import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Station } from '../core/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StationListServiceService {
  private stationList: Station[] = [];
  private stationListSubject$: BehaviorSubject<Station[]> = new BehaviorSubject<Station[]>(this.stationList);

  constructor() {}

  getStationList(): Observable<Station[]> {
    return this.stationListSubject$.asObservable();
  }

  setStationList(newStationList: Station[]): void {
    this.stationList = newStationList;
    this.stationListSubject$.next(this.stationList);
  }

  addStation(station: Station): void {
    this.stationList.push(station);
    this.stationListSubject$.next(this.stationList);
  }

  removeStation(stationId: string): void {
    this.stationList = this.stationList.filter(s => s.stationuuid !== stationId);
    this.stationListSubject$.next(this.stationList);
  }

  clearStations(): void {
    this.stationList = [];
    this.stationListSubject$.next(this.stationList);
  }

  getStationById(stationId: string): Station | undefined {
    return this.stationList.find(s => s.stationuuid === stationId);
  }

  getStationCount(): number {
    return this.stationList.length;
  }
}


