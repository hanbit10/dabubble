import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectNavComponent } from './direct-nav.component';

describe('DirectNavComponent', () => {
  let component: DirectNavComponent;
  let fixture: ComponentFixture<DirectNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
