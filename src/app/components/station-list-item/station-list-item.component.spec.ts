import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationListItemComponent } from './station-list-item.component';

describe('StationListItemComponent', () => {
  let component: StationListItemComponent;
  let fixture: ComponentFixture<StationListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationListItemComponent]
    });
    fixture = TestBed.createComponent(StationListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
