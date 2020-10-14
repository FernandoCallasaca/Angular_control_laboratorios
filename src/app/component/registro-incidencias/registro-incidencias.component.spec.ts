import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIncidenciasComponent } from './registro-incidencias.component';

describe('RegistroIncidenciasComponent', () => {
  let component: RegistroIncidenciasComponent;
  let fixture: ComponentFixture<RegistroIncidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroIncidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroIncidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
