import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlIncidenciasComponent } from './control-incidencias.component';

describe('ControlIncidenciasComponent', () => {
  let component: ControlIncidenciasComponent;
  let fixture: ComponentFixture<ControlIncidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlIncidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
