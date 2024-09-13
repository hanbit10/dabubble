import { TestBed } from '@angular/core/testing';

import { MessageUserService } from './message-user.service';

describe('MessageUserService', () => {
  let service: MessageUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
