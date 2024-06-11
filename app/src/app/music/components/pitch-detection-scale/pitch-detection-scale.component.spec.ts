import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchDetectionScaleComponent } from './pitch-detection-scale.component';

describe('PitchDetectionScaleComponent', () => {
  let component: PitchDetectionScaleComponent;
  let fixture: ComponentFixture<PitchDetectionScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchDetectionScaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchDetectionScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
