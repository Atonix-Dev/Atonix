import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavStationService {
  private stationIndex: number = 0;
  private stationIndexSubjet$: BehaviorSubject<number> = new BehaviorSubject<number>(this.stationIndex);

  constructor() { }

  public getStationIndex(): Observable<number>{
    return this.stationIndexSubjet$.asObservable()
  }

  public setStationIndex(newStationIndex: number): void{
    this.stationIndex = newStationIndex
    this.stationIndexSubjet$.next(this.stationIndex);
  }


}
