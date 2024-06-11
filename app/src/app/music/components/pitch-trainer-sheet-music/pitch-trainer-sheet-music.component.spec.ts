import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTrainerSheetMusicComponent } from './pitch-trainer-sheet-music.component';

describe('PitchTrainerSheetMusicComponent', () => {
  let component: PitchTrainerSheetMusicComponent;
  let fixture: ComponentFixture<PitchTrainerSheetMusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchTrainerSheetMusicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchTrainerSheetMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
