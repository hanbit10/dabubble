import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WillkommenComponent } from './willkommen.component';

describe('WillkommenComponent', () => {
  let component: WillkommenComponent;
  let fixture: ComponentFixture<WillkommenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WillkommenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WillkommenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
