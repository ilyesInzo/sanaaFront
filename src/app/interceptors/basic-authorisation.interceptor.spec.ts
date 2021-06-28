import { TestBed } from '@angular/core/testing';

import { BasicAuthorisationInterceptor } from './basic-authorisation.interceptor';

describe('BasicAuthorisationInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BasicAuthorisationInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BasicAuthorisationInterceptor = TestBed.inject(BasicAuthorisationInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
