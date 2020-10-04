import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoportetipoComponent } from './soportetipo.component';

describe('SoportetipoComponent', () => {
  let component: SoportetipoComponent;
  let fixture: ComponentFixture<SoportetipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoportetipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoportetipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
