import { TestBed } from '@angular/core/testing';

import { NavStationService } from './nav-station.service';

describe('NavStationService', () => {
  let service: NavStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
