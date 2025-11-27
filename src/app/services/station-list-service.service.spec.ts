import { TestBed } from '@angular/core/testing';

import { StationListServiceService } from './station-list-service.service';

describe('StationListServiceService', () => {
  let service: StationListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
