import { TestBed } from '@angular/core/testing';

import { PopulateFormService } from './populate-form.service';

describe('PopulateFormService', () => {
  let service: PopulateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulateFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
