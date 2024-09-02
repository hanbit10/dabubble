import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAvatarCardComponent } from './create-avatar-card.component';

describe('CreateAvatarCardComponent', () => {
  let component: CreateAvatarCardComponent;
  let fixture: ComponentFixture<CreateAvatarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAvatarCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAvatarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
