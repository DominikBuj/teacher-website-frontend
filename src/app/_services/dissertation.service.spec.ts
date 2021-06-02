import {TestBed} from '@angular/core/testing';

import {DissertationService} from './dissertation.service';

describe('DissertationService', () => {
  let service: DissertationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DissertationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
