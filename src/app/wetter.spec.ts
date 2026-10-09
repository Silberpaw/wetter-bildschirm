import { TestBed } from '@angular/core/testing';
import { Wetter } from './wetter';

describe('Wetter', () => {
  let service: Wetter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wetter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
