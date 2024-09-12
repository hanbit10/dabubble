import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLeftComponent } from './message-left.component';

describe('MessageLeftComponent', () => {
  let component: MessageLeftComponent;
  let fixture: ComponentFixture<MessageLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLeftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
