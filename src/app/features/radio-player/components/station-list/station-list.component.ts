import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Radio } from '../../models/radio.model';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent {
  @Input() stations: Radio[] = [];
  @Input() currentStation: Radio | null = null;
  @Output() onStationSelect = new EventEmitter<Radio>();

  selectStation(station: Radio): void {
    this.onStationSelect.emit(station);
  }

  isCurrentStation(station: Radio): boolean {
    return this.currentStation?.stationuuid === station.stationuuid;
  }
}