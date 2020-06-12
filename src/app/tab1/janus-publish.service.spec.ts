import { TestBed } from '@angular/core/testing';

import { JanusPublishService } from './janus-publish.service';

describe('JanusPublishService', () => {
  let service: JanusPublishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JanusPublishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
