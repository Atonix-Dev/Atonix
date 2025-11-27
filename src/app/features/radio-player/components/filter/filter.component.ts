import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { StationFilter } from '../../models/radio.model';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Output() onFiltersChange = new EventEmitter<StationFilter>();

  countries: Country[] = [
    { name: 'Argentina', code: 'AR' },
    { name: 'España', code: 'ES' },
    { name: 'Estados Unidos', code: 'US' },
    { name: 'México', code: 'MX' },
    { name: 'Chile', code: 'CL' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Perú', code: 'PE' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Brasil', code: 'BR' }
  ];

  limits = [50, 100, 200, 300];

  selectedCountry = 'AR';
  selectedLimit = 300;

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.onFiltersChange.emit({
      countrycode: this.selectedCountry,
      limit: this.selectedLimit,
      order: 'votes',
      reverse: true
    });
  }
}