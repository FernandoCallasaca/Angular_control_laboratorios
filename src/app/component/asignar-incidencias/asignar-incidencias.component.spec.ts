import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarIncidenciasComponent } from './asignar-incidencias.component';

describe('AsignarIncidenciasComponent', () => {
  let component: AsignarIncidenciasComponent;
  let fixture: ComponentFixture<AsignarIncidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarIncidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
