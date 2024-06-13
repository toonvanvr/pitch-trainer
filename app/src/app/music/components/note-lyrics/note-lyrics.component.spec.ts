import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteLyricsComponent } from './note-lyrics.component';

describe('NoteLyricsComponent', () => {
  let component: NoteLyricsComponent;
  let fixture: ComponentFixture<NoteLyricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteLyricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
