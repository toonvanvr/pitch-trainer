import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicSchoolAuthComponent } from './music-school-auth.component';

describe('MusicSchoolAuthComponent', () => {
  let component: MusicSchoolAuthComponent;
  let fixture: ComponentFixture<MusicSchoolAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicSchoolAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicSchoolAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
