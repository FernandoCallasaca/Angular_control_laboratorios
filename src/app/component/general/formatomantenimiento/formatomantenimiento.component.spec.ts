import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatomantenimientoComponent } from './formatomantenimiento.component';

describe('FormatomantenimientoComponent', () => {
  let component: FormatomantenimientoComponent;
  let fixture: ComponentFixture<FormatomantenimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatomantenimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatomantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
