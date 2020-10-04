import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioubigeoComponent } from './usuarioubigeo.component';

describe('UsuarioubigeoComponent', () => {
  let component: UsuarioubigeoComponent;
  let fixture: ComponentFixture<UsuarioubigeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioubigeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioubigeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
