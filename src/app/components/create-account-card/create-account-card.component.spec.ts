import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountCardComponent } from './create-account-card.component';

describe('CreateAccountCardComponent', () => {
  let component: CreateAccountCardComponent;
  let fixture: ComponentFixture<CreateAccountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
