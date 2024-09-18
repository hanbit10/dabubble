import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignPasswordCardComponent } from './reassign-password-card.component';

describe('ReassignPasswordCardComponent', () => {
  let component: ReassignPasswordCardComponent;
  let fixture: ComponentFixture<ReassignPasswordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReassignPasswordCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReassignPasswordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
