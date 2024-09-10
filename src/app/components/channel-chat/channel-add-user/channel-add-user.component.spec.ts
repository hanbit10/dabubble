import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAddUserComponent } from './channel-add-user.component';

describe('ChannelAddUserComponent', () => {
  let component: ChannelAddUserComponent;
  let fixture: ComponentFixture<ChannelAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAddUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
