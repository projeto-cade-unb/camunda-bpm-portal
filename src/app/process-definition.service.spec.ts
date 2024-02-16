import { TestBed } from '@angular/core/testing';

import { ProcessDefinitionService } from './process-definition.service';

describe('ProcessDefinitionService', () => {
  let service: ProcessDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
