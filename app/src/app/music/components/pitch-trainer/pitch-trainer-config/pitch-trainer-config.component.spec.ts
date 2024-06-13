import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTrainerConfigComponent } from './pitch-trainer-config.component';

describe('PitchTrainerConfigComponent', () => {
  let component: PitchTrainerConfigComponent;
  let fixture: ComponentFixture<PitchTrainerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchTrainerConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchTrainerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
