import {TestBed} from '@angular/core/testing';

import {OrcidService} from './orcid.service';

describe('OrcidService', () => {
  let service: OrcidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrcidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
