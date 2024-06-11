import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTrainerSlidingChartComponent } from './pitch-trainer-sliding-chart.component';

describe('PitchTrainerSlidingChartComponent', () => {
  let component: PitchTrainerSlidingChartComponent;
  let fixture: ComponentFixture<PitchTrainerSlidingChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchTrainerSlidingChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchTrainerSlidingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
