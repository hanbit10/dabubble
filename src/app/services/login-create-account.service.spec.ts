import { TestBed } from '@angular/core/testing';

import { LoginCreateAccountService } from './login-create-account.service';

describe('LoginCreateAccountServiceService', () => {
  let service: LoginCreateAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginCreateAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
