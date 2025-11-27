import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPlayerComponent } from './audioplayer.component';

describe('AudioplayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioPlayerComponent]
    });
    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
