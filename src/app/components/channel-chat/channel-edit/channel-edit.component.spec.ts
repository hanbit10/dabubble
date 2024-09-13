import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelEditComponent } from './channel-edit.component';

describe('ChannelEditComponent', () => {
  let component: ChannelEditComponent;
  let fixture: ComponentFixture<ChannelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
