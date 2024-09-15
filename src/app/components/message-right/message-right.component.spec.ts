import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageRightComponent } from './message-right.component';

describe('MessageRightComponent', () => {
  let component: MessageRightComponent;
  let fixture: ComponentFixture<MessageRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageRightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
