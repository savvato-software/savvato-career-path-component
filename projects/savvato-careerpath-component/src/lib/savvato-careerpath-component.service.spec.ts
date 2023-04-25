import { TestBed } from '@angular/core/testing';

import { SavvatoCareerpathComponentService } from './savvato-careerpath-component.service';

describe('SavvatoCareerpathComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavvatoCareerpathComponentService = TestBed.get(SavvatoCareerpathComponentService);
    expect(service).toBeTruthy();
  });
});
