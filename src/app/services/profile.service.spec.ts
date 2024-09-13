import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';

ProfileService

describe('MessageUserService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
