import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartoComponent } from './reparto.component';

describe('RepartoComponent', () => {
  let component: RepartoComponent;
  let fixture: ComponentFixture<RepartoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
