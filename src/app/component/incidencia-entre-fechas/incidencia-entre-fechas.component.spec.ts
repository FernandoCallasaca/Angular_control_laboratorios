import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaEntreFechasComponent } from './incidencia-entre-fechas.component';

describe('IncidenciaEntreFechasComponent', () => {
  let component: IncidenciaEntreFechasComponent;
  let fixture: ComponentFixture<IncidenciaEntreFechasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenciaEntreFechasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenciaEntreFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
