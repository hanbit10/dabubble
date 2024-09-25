import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressumCardComponent } from './impressum-card.component';

describe('ImpressumCardComponent', () => {
  let component: ImpressumCardComponent;
  let fixture: ComponentFixture<ImpressumCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressumCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImpressumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
