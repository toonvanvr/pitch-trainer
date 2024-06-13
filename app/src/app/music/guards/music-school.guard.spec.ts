import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { musicSchoolGuard } from './music-school.guard';

describe('musicSchoolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => musicSchoolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
