import { TestBed, inject } from '@angular/core/testing';

import { Three3dService } from './three3d.service';

describe('Three3dService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Three3dService]
    });
  });

  it('should ...', inject([Three3dService], (service: Three3dService) => {
    expect(service).toBeTruthy();
  }));
});
