import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTrainerHeaderComponent } from './pitch-trainer-header.component';

describe('PitchTrainerHeaderComponent', () => {
  let component: PitchTrainerHeaderComponent;
  let fixture: ComponentFixture<PitchTrainerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchTrainerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchTrainerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
