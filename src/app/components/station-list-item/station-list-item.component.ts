import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'station-list-item',
  templateUrl: './station-list-item.component.html',
  styleUrls: ['./station-list-item.component.css']
})
export class StationListItemComponent implements OnInit {
  @Input('station-name') stationName: string = '';
  @Input('is-selected') isSelected: boolean = false;

  constructor(){}

  ngOnInit(): void {

  }

}
