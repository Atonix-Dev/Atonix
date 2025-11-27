import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredComponent } from './filtered.component';

describe('FilteredComponent', () => {
  let component: FilteredComponent;
  let fixture: ComponentFixture<FilteredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilteredComponent]
    });
    fixture = TestBed.createComponent(FilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
