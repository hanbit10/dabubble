import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadChatsComponent } from './thread-chats.component';

describe('ThreadChatsComponent', () => {
  let component: ThreadChatsComponent;
  let fixture: ComponentFixture<ThreadChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadChatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreadChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
