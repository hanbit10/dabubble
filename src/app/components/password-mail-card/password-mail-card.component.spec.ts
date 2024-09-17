import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordMailCardComponent } from './password-mail-card.component';

describe('PasswordMailCardComponent', () => {
  let component: PasswordMailCardComponent;
  let fixture: ComponentFixture<PasswordMailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordMailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordMailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
